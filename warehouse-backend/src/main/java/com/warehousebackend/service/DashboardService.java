package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.OrderStatus;
import com.warehousebackend.entity.ShipmentStatus;
import com.warehousebackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final ShipmentRepository shipmentRepository;
    private final ProductRepository productRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total orders
        long totalOrders = orderRepository.count();
        stats.put("totalOrders", totalOrders);

        // Pending orders
        long pendingOrders = orderRepository.findByStatus(OrderStatus.PENDING).size();
        stats.put("pendingOrders", pendingOrders);

        // Low stock items
        long lowStockItems = inventoryRepository.findLowStockItems().size();
        stats.put("lowStockItems", lowStockItems);

        // Active shipments
        List<ShipmentStatus> activeStatuses = Arrays.asList(
                ShipmentStatus.PENDING,
                ShipmentStatus.PICKED_UP,
                ShipmentStatus.IN_TRANSIT,
                ShipmentStatus.OUT_FOR_DELIVERY
        );
        long activeShipments = shipmentRepository.findByStatusIn(activeStatuses).size();
        stats.put("activeShipments", activeShipments);

        // Total products
        long totalProducts = productRepository.count();
        stats.put("totalProducts", totalProducts);

        return stats;
    }

    public Map<String, Object> getOrderTrend(int days) {
        Map<String, Object> trend = new HashMap<>();
        List<Map<String, Object>> data = new ArrayList<>();

        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(days);

        for (int i = 0; i < days; i++) {
            LocalDateTime date = startDate.plusDays(i);
            LocalDateTime nextDate = date.plusDays(1);

            long orderCount = orderRepository.findByOrderDateBetween(date, nextDate).size();

            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", date.toLocalDate().toString());
            dayData.put("orders", orderCount);
            data.add(dayData);
        }

        trend.put("data", data);
        return trend;
    }

    public Map<String, Object> getInventorySummary() {
        Map<String, Object> summary = new HashMap<>();

        // Group by category
        List<Object[]> categoryData = inventoryRepository.findAll().stream()
                .collect(
                        java.util.stream.Collectors.groupingBy(
                                inv -> inv.getProduct().getCategory(),
                                java.util.stream.Collectors.summingInt(inv -> inv.getQuantity())
                        )
                )
                .entrySet().stream()
                .map(entry -> new Object[]{entry.getKey(), entry.getValue()})
                .toList();

        summary.put("byCategory", categoryData);

        return summary;
    }
}