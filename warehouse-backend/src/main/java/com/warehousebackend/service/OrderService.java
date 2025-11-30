package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.order.*;
import com.warehousebackend.entity.*;
import com.warehousebackend.exception.BusinessException;
import com.warehousebackend.exception.ResourceNotFoundException;
import com.warehousebackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse createOrder(OrderDTO dto) {
        // Validate warehouse
        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        // Create order
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .warehouse(warehouse)
                .status(OrderStatus.PENDING)
                .customerName(dto.getCustomerName())
                .customerEmail(dto.getCustomerEmail())
                .customerPhone(dto.getCustomerPhone())
                .shippingAddress(dto.getShippingAddress())
                .shippingCity(dto.getShippingCity())
                .shippingDistrict(dto.getShippingDistrict())
                .shippingLatitude(dto.getShippingLatitude())
                .shippingLongitude(dto.getShippingLongitude())
                .shippingFee(dto.getShippingFee() != null ? dto.getShippingFee() : BigDecimal.ZERO)
                .discount(dto.getDiscount() != null ? dto.getDiscount() : BigDecimal.ZERO)
                .tax(BigDecimal.ZERO)
                .paymentMethod(dto.getPaymentMethod())
                .paymentStatus("PENDING")
                .notes(dto.getNotes())
                .items(new ArrayList<>())
                .build();

        // Add customer if provided
        if (dto.getCustomerId() != null) {
            User customer = userRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
            order.setCustomer(customer);
        }

        // Process order items
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemDto.getProductId()));

            // Check inventory
            Inventory inventory = inventoryRepository
                    .findByProductAndWarehouse(product, warehouse)
                    .orElseThrow(() -> new BusinessException("Product not available in warehouse: " + product.getName()));

            if (inventory.getAvailableQuantity() < itemDto.getQuantity()) {
                throw new BusinessException("Insufficient stock for product: " + product.getName() +
                        ". Available: " + inventory.getAvailableQuantity() + ", Requested: " + itemDto.getQuantity());
            }

            // Create order item
            BigDecimal itemPrice = itemDto.getPrice() != null ? itemDto.getPrice() : product.getPrice();
            BigDecimal itemDiscount = itemDto.getDiscount() != null ? itemDto.getDiscount() : BigDecimal.ZERO;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .price(itemPrice)
                    .discount(itemDiscount)
                    .notes(itemDto.getNotes())
                    .build();

            orderItem.calculateSubtotal();
            order.getItems().add(orderItem);
            subtotal = subtotal.add(orderItem.getSubtotal());

            // Reserve inventory
            inventory.setReservedQuantity(inventory.getReservedQuantity() + itemDto.getQuantity());
            inventoryRepository.save(inventory);
        }

        // Calculate totals
        order.setSubtotal(subtotal);
        order.calculateTotalAmount();

        // Set expected delivery (3 days from now)
        order.setExpectedDeliveryDate(LocalDateTime.now().plusDays(3));

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.from(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String statusStr) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus newStatus = OrderStatus.valueOf(statusStr);
        OrderStatus oldStatus = order.getStatus();

        // Validate status transition
        validateStatusTransition(oldStatus, newStatus);

        order.setStatus(newStatus);

        // Handle inventory based on status
        if (newStatus == OrderStatus.CANCELLED) {
            // Release reserved inventory
            releaseInventory(order);
        } else if (newStatus == OrderStatus.SHIPPED) {
            // Deduct from actual inventory
            deductInventory(order);
        }

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.from(savedOrder);
    }

    private void validateStatusTransition(OrderStatus from, OrderStatus to) {
        // Add validation rules
        if (from == OrderStatus.DELIVERED || from == OrderStatus.CANCELLED) {
            throw new BusinessException("Cannot change status from " + from);
        }
    }

    private void releaseInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            Inventory inventory = inventoryRepository
                    .findByProductAndWarehouse(item.getProduct(), order.getWarehouse())
                    .orElseThrow(() -> new BusinessException("Inventory not found"));

            inventory.setReservedQuantity(inventory.getReservedQuantity() - item.getQuantity());
            inventoryRepository.save(inventory);
        }
    }

    private void deductInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            Inventory inventory = inventoryRepository
                    .findByProductAndWarehouse(item.getProduct(), order.getWarehouse())
                    .orElseThrow(() -> new BusinessException("Inventory not found"));

            // Deduct from actual quantity and reserved
            inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
            inventory.setReservedQuantity(inventory.getReservedQuantity() - item.getQuantity());
            inventory.setLastStockOut(LocalDateTime.now());
            inventoryRepository.save(inventory);
        }
    }

    public Page<OrderResponse> getOrders(OrderStatus status, Pageable pageable) {
        Page<Order> orders;
        if (status != null) {
            orders = orderRepository.findAll(
                    (root, query, cb) -> cb.equal(root.get("status"), status),
                    pageable
            );
        } else {
            orders = orderRepository.findAll(pageable);
        }
        return orders.map(OrderResponse::from);
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return OrderResponse.from(order);
    }

    private String generateOrderNumber() {
        return "ORD-" + LocalDateTime.now().getYear() +
                String.format("%02d", LocalDateTime.now().getMonthValue()) +
                String.format("%02d", LocalDateTime.now().getDayOfMonth()) + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}