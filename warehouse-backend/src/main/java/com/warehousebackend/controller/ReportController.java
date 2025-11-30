package com.warehousebackend.controller;

/**
 * @author MyDuyen
 */

import com.warehousebackend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/sales")
    public ResponseEntity<Map<String, Object>> getSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, Object> report = reportService.generateSalesReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/inventory")
    public ResponseEntity<Map<String, Object>> getInventoryReport() {
        Map<String, Object> report = reportService.generateInventoryReport();
        return ResponseEntity.ok(report);
    }

    @GetMapping("/shipments")
    public ResponseEntity<Map<String, Object>> getShipmentReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, Object> report = reportService.generateShipmentReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/inventory-movement/{productId}")
    public ResponseEntity<Map<String, Object>> getInventoryMovementReport(
            @PathVariable Long productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, Object> report = reportService.generateInventoryMovementReport(
                productId, startDate, endDate
        );
        return ResponseEntity.ok(report);
    }
}