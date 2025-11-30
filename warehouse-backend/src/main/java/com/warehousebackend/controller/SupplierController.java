package com.warehousebackend.controller;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.supplier.*;
import com.warehousebackend.service.SupplierService;
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
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<Page<SupplierResponse>> getAllSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SupplierResponse> suppliers = supplierService.getAllSuppliers(pageable);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/active")
    public ResponseEntity<List<SupplierResponse>> getActiveSuppliers() {
        List<SupplierResponse> suppliers = supplierService.getActiveSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SupplierResponse>> searchSuppliers(
            @RequestParam String keyword) {
        List<SupplierResponse> suppliers = supplierService.searchSuppliers(keyword);
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getSupplierById(@PathVariable Long id) {
        SupplierResponse response = supplierService.getSupplierById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<SupplierResponse> createSupplier(@Valid @RequestBody SupplierDTO dto) {
        SupplierResponse response = supplierService.createSupplier(dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<SupplierResponse> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody SupplierDTO dto) {
        SupplierResponse response = supplierService.updateSupplier(id, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/rating")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<SupplierResponse> updateRating(
            @PathVariable Long id,
            @RequestParam Double rating) {
        SupplierResponse response = supplierService.updateRating(id, rating);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok("Supplier deleted successfully");
    }
}