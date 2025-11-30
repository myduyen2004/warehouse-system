package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.shipment.*;
import com.warehousebackend.entity.*;
import com.warehousebackend.exception.BusinessException;
import com.warehousebackend.exception.ResourceNotFoundException;
import com.warehousebackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final ShipmentTrackingRepository trackingRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ShipmentResponse createShipment(CreateShipmentDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getShipment() != null) {
            throw new BusinessException("Shipment already exists for this order");
        }

        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!"AVAILABLE".equals(vehicle.getStatus())) {
            throw new BusinessException("Vehicle is not available");
        }

        User driver = userRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        if (driver.getRole() != Role.DRIVER) {
            throw new BusinessException("User is not a driver");
        }

        Shipment shipment = Shipment.builder()
                .trackingNumber(generateTrackingNumber())
                .order(order)
                .vehicle(vehicle)
                .driver(driver)
                .status(ShipmentStatus.PENDING)
                .pickupTime(dto.getPickupTime())
                .estimatedDeliveryTime(dto.getEstimatedDeliveryTime() != null ?
                        dto.getEstimatedDeliveryTime() : LocalDateTime.now().plusHours(4))
                .deliveryNotes(dto.getNotes())
                .build();

        // Update vehicle status
        vehicle.setStatus("IN_USE");
        vehicle.setCurrentDriver(driver);
        vehicleRepository.save(vehicle);

        // Update order status
        order.setStatus(OrderStatus.SHIPPED);
        orderRepository.save(order);

        Shipment savedShipment = shipmentRepository.save(shipment);
        return ShipmentResponse.from(savedShipment);
    }

    @Transactional
    public ShipmentResponse updateLocation(Long shipmentId, LocationUpdateDTO dto) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        shipment.setCurrentLatitude(dto.getLatitude());
        shipment.setCurrentLongitude(dto.getLongitude());
        shipment.setCurrentSpeed(dto.getSpeed());

        if (shipment.getStatus() == ShipmentStatus.PENDING ||
                shipment.getStatus() == ShipmentStatus.PICKED_UP) {
            shipment.setStatus(ShipmentStatus.IN_TRANSIT);
        }

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Record tracking
        ShipmentTracking tracking = ShipmentTracking.builder()
                .shipment(shipment)
                .status(shipment.getStatus())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .speed(dto.getSpeed())
                .location(dto.getLocation())
                .notes(dto.getNotes())
                .build();
        trackingRepository.save(tracking);

        // Send real-time update via WebSocket
        ShipmentResponse response = ShipmentResponse.from(savedShipment);
        messagingTemplate.convertAndSend(
                "/topic/shipments/" + shipmentId,
                response
        );

        return response;
    }

    @Transactional
    public ShipmentResponse updateStatus(Long shipmentId, String statusStr) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));

        ShipmentStatus newStatus = ShipmentStatus.valueOf(statusStr);
        shipment.setStatus(newStatus);

        if (newStatus == ShipmentStatus.DELIVERED) {
            shipment.setActualDeliveryTime(LocalDateTime.now());
            shipment.getOrder().setStatus(OrderStatus.DELIVERED);
            shipment.getOrder().setActualDeliveryDate(LocalDateTime.now());
            orderRepository.save(shipment.getOrder());

            // Release vehicle
            Vehicle vehicle = shipment.getVehicle();
            vehicle.setStatus("AVAILABLE");
            vehicle.setCurrentDriver(null);
            vehicleRepository.save(vehicle);
        }

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Send WebSocket update
        messagingTemplate.convertAndSend(
                "/topic/shipments/" + shipmentId,
                ShipmentResponse.from(savedShipment)
        );

        return ShipmentResponse.from(savedShipment);
    }

    public ShipmentResponse getShipmentByTracking(String trackingNumber) {
        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));
        return ShipmentResponse.from(shipment);
    }

    public List<ShipmentResponse> getActiveShipments() {
        List<ShipmentStatus> activeStatuses = List.of(
                ShipmentStatus.PENDING,
                ShipmentStatus.PICKED_UP,
                ShipmentStatus.IN_TRANSIT,
                ShipmentStatus.OUT_FOR_DELIVERY
        );

        return shipmentRepository.findByStatusIn(activeStatuses).stream()
                .map(ShipmentResponse::from)
                .collect(Collectors.toList());
    }

    private String generateTrackingNumber() {
        return "TRK-" + LocalDateTime.now().getYear() +
                String.format("%02d", LocalDateTime.now().getMonthValue()) +
                UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }
}