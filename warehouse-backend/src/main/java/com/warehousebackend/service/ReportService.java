package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.*;
import com.warehousebackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final ShipmentRepository shipmentRepository;
    private final InventoryTransactionRepository transactionRepository;

    public Map<String, Object> generateSalesReport(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();

        List<Order> orders = orderRepository.findByOrderDateBetween(startDate, endDate);

        // Total sales
        BigDecimal totalSales = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Total orders
        long totalOrders = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .count();

        // Average order value
        BigDecimal avgOrderValue = totalOrders > 0 ?
                totalSales.divide(BigDecimal.valueOf(totalOrders), 2, BigDecimal.ROUND_HALF_UP) :
                BigDecimal.ZERO;

        // Orders by status
        Map<OrderStatus, Long> ordersByStatus = orders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

        // Daily sales trend
        Map<String, BigDecimal> dailySales = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().toLocalDate().toString(),
                        Collectors.reducing(BigDecimal.ZERO, Order::getTotalAmount, BigDecimal::add)
                ));

        report.put("totalSales", totalSales);
        report.put("totalOrders", totalOrders);
        report.put("avgOrderValue", avgOrderValue);
        report.put("ordersByStatus", ordersByStatus);
        report.put("dailySales", dailySales);
        report.put("startDate", startDate);
        report.put("endDate", endDate);

        return report;
    }

    public Map<String, Object> generateInventoryReport() {
        Map<String, Object> report = new HashMap<>();

        List<Inventory> allInventory = inventoryRepository.findAll();

        // Total inventory value
        BigDecimal totalValue = allInventory.stream()
                .map(inv -> {
                    BigDecimal price = inv.getProduct().getPrice();
                    int quantity = inv.getQuantity();
                    return price.multiply(BigDecimal.valueOf(quantity));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Total SKUs
        long totalSkus = allInventory.size();

        // Total quantity
        int totalQuantity = allInventory.stream()
                .mapToInt(Inventory::getQuantity)
                .sum();

        // Low stock items
        List<Inventory> lowStock = inventoryRepository.findLowStockItems();

        // Over stock items
        List<Inventory> overStock = inventoryRepository.findOverStockItems();

        // Inventory by category
        Map<String, Integer> byCategory = allInventory.stream()
                .collect(Collectors.groupingBy(
                        inv -> inv.getProduct().getCategory(),
                        Collectors.summingInt(Inventory::getQuantity)
                ));

        // Inventory by warehouse
        Map<String, Integer> byWarehouse = allInventory.stream()
                .collect(Collectors.groupingBy(
                        inv -> inv.getWarehouse().getName(),
                        Collectors.summingInt(Inventory::getQuantity)
                ));

        report.put("totalValue", totalValue);
        report.put("totalSkus", totalSkus);
        report.put("totalQuantity", totalQuantity);
        report.put("lowStockCount", lowStock.size());
        report.put("overStockCount", overStock.size());
        report.put("byCategory", byCategory);
        report.put("byWarehouse", byWarehouse);

        return report;
    }

    public Map<String, Object> generateShipmentReport(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();

        List<Shipment> shipments = shipmentRepository.findAll().stream()
                .filter(s -> s.getCreatedAt().isAfter(startDate) && s.getCreatedAt().isBefore(endDate))
                .collect(Collectors.toList());

        // Total shipments
        long totalShipments = shipments.size();

        // Shipments by status
        Map<ShipmentStatus, Long> byStatus = shipments.stream()
                .collect(Collectors.groupingBy(Shipment::getStatus, Collectors.counting()));

        // On-time delivery rate
        long deliveredOnTime = shipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.DELIVERED)
                .filter(s -> s.getActualDeliveryTime() != null && s.getEstimatedDeliveryTime() != null)
                .filter(s -> !s.getActualDeliveryTime().isAfter(s.getEstimatedDeliveryTime()))
                .count();

        long totalDelivered = shipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.DELIVERED)
                .count();

        double onTimeRate = totalDelivered > 0 ?
                (deliveredOnTime * 100.0) / totalDelivered : 0.0;

        // Average delivery time
        double avgDeliveryHours = shipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.DELIVERED)
                .filter(s -> s.getPickupTime() != null && s.getActualDeliveryTime() != null)
                .mapToLong(s -> java.time.Duration.between(
                        s.getPickupTime(),
                        s.getActualDeliveryTime()
                ).toHours())
                .average()
                .orElse(0.0);

        // Delayed shipments
        List<Shipment> delayed = shipmentRepository.findDelayedShipments(LocalDateTime.now());

        report.put("totalShipments", totalShipments);
        report.put("byStatus", byStatus);
        report.put("onTimeDeliveryRate", onTimeRate);
        report.put("avgDeliveryHours", avgDeliveryHours);
        report.put("delayedShipments", delayed.size());
        report.put("startDate", startDate);
        report.put("endDate", endDate);

        return report;
    }

    public Map<String, Object> generateInventoryMovementReport(Long productId,
                                                               LocalDateTime startDate,
                                                               LocalDateTime endDate) {
        Map<String, Object> report = new HashMap<>();

        List<InventoryTransaction> transactions = transactionRepository
                .findByDateRange(startDate, endDate).stream()
                .filter(t -> t.getInventory().getProduct().getId().equals(productId))
                .collect(Collectors.toList());

        // Total stock in
        int totalStockIn = transactions.stream()
                .filter(t -> t.getType() == TransactionType.STOCK_IN)
                .mapToInt(InventoryTransaction::getQuantity)
                .sum();

        // Total stock out
        int totalStockOut = transactions.stream()
                .filter(t -> t.getType() == TransactionType.STOCK_OUT)
                .mapToInt(InventoryTransaction::getQuantity)
                .sum();

        // Net movement
        int netMovement = totalStockIn - totalStockOut;

        // Transactions by type
        Map<TransactionType, Long> byType = transactions.stream()
                .collect(Collectors.groupingBy(InventoryTransaction::getType, Collectors.counting()));

        report.put("totalStockIn", totalStockIn);
        report.put("totalStockOut", totalStockOut);
        report.put("netMovement", netMovement);
        report.put("transactionsByType", byType);
        report.put("totalTransactions", transactions.size());
        report.put("startDate", startDate);
        report.put("endDate", endDate);

        return report;
    }
}