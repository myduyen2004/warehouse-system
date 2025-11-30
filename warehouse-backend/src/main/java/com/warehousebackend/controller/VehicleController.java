package com.warehousebackend.controller;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.vehicle.*;
import com.warehousebackend.service.VehicleService;
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
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<Page<VehicleResponse>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<VehicleResponse> vehicles = vehicleService.getAllVehicles(pageable);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/available")
    public ResponseEntity<List<VehicleResponse>> getAvailableVehicles() {
        List<VehicleResponse> vehicles = vehicleService.getAvailableVehicles();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/maintenance-due")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<VehicleResponse>> getVehiclesNeedingMaintenance() {
        List<VehicleResponse> vehicles = vehicleService.getVehiclesNeedingMaintenance();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable Long id) {
        VehicleResponse response = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleDTO dto) {
        VehicleResponse response = vehicleService.createVehicle(dto);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleDTO dto) {
        VehicleResponse response = vehicleService.updateVehicle(id, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/mileage")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN', 'MANAGER')")
    public ResponseEntity<VehicleResponse> updateMileage(
            @PathVariable Long id,
            @RequestParam Double mileage) {
        VehicleResponse response = vehicleService.updateMileage(id, mileage);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<VehicleResponse> recordMaintenance(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceDTO dto) {
        VehicleResponse response = vehicleService.recordMaintenance(id, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{vehicleId}/assign-driver/{driverId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<VehicleResponse> assignDriver(
            @PathVariable Long vehicleId,
            @PathVariable Long driverId) {
        VehicleResponse response = vehicleService.assignDriver(vehicleId, driverId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok("Vehicle deleted successfully");
    }
}
