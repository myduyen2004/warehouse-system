package com.warehousebackend.controller;

import com.warehousebackend.entity.Order;
import com.warehousebackend.entity.Product;
import com.warehousebackend.entity.Warehouse;
import com.warehousebackend.repository.OrderRepository;
import com.warehousebackend.repository.ProductRepository;
import com.warehousebackend.repository.WarehouseRepository;
import com.warehousebackend.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ShipmentRepository shipmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalWarehouses", warehouseRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("activeShipments", shipmentRepository.countByStatus("IN_TRANSIT"));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<Order>> getRecentOrders(@RequestParam(defaultValue = "5") int limit) {
        PageRequest pageRequest = PageRequest.of(0, limit);
        List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc(pageRequest);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<Product>> getTopProducts(@RequestParam(defaultValue = "5") int limit) {
        PageRequest pageRequest = PageRequest.of(0, limit);
        List<Product> products = productRepository.findAllByOrderByStockQuantityDesc(pageRequest);
        return ResponseEntity.ok(products);
    }
}