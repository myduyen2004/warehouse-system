package com.warehousebackend.controller;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.inventory.*;
import com.warehousebackend.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<Page<InventoryResponse>> getAllInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InventoryResponse> inventory = inventoryService.getAllInventory(pageable);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<InventoryResponse>> getInventoryByWarehouse(
            @PathVariable Long warehouseId) {
        List<InventoryResponse> inventory = inventoryService.getInventoryByWarehouse(warehouseId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStockAlert() {
        List<InventoryResponse> items = inventoryService.getLowStockAlert();
        return ResponseEntity.ok(items);
    }

    @PostMapping("/stock-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE_STAFF')")
    public ResponseEntity<InventoryResponse> stockIn(@Valid @RequestBody StockDTO dto) {
        InventoryResponse response = inventoryService.stockIn(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/stock-out")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'WAREHOUSE_STAFF')")
    public ResponseEntity<InventoryResponse> stockOut(@Valid @RequestBody StockDTO dto) {
        InventoryResponse response = inventoryService.stockOut(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<String> transferStock(@Valid @RequestBody StockTransferDTO dto) {
        inventoryService.transferStock(dto);
        return ResponseEntity.ok("Stock transferred successfully");
    }
}