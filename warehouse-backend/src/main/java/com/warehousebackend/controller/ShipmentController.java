package com.warehousebackend.controller;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.shipment.*;
import com.warehousebackend.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ShipmentResponse> createShipment(@Valid @RequestBody CreateShipmentDTO dto) {
        ShipmentResponse response = shipmentService.createShipment(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<ShipmentResponse> getShipmentByTracking(@PathVariable String trackingNumber) {
        ShipmentResponse response = shipmentService.getShipmentByTracking(trackingNumber);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ShipmentResponse>> getActiveShipments() {
        List<ShipmentResponse> shipments = shipmentService.getActiveShipments();
        return ResponseEntity.ok(shipments);
    }

    @PatchMapping("/{id}/location")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ShipmentResponse> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody LocationUpdateDTO dto) {
        ShipmentResponse response = shipmentService.updateLocation(id, dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN', 'MANAGER')")
    public ResponseEntity<ShipmentResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ShipmentResponse response = shipmentService.updateStatus(id, status);
        return ResponseEntity.ok(response);
    }
}