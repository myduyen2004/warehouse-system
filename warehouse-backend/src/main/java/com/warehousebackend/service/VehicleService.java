package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.vehicle.*;
import com.warehousebackend.entity.User;
import com.warehousebackend.entity.Vehicle;
import com.warehousebackend.exception.BusinessException;
import com.warehousebackend.exception.ResourceNotFoundException;
import com.warehousebackend.repository.UserRepository;
import com.warehousebackend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public Page<VehicleResponse> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable)
                .map(VehicleResponse::from);
    }

    public List<VehicleResponse> getAvailableVehicles() {
        return vehicleRepository.findByStatus("AVAILABLE").stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        return VehicleResponse.from(vehicle);
    }

    public List<VehicleResponse> getVehiclesNeedingMaintenance() {
        LocalDateTime nextWeek = LocalDateTime.now().plusDays(7);
        return vehicleRepository.findVehiclesNeedingMaintenance(nextWeek).stream()
                .map(VehicleResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleResponse createVehicle(VehicleDTO dto) {
        if (vehicleRepository.findByLicensePlate(dto.getLicensePlate()).isPresent()) {
            throw new BusinessException("Vehicle with license plate already exists");
        }

        Vehicle vehicle = Vehicle.builder()
                .licensePlate(dto.getLicensePlate())
                .vehicleType(dto.getVehicleType())
                .brand(dto.getBrand())
                .model(dto.getModel())
                .year(dto.getYear())
                .capacity(dto.getCapacity())
                .volumeCapacity(dto.getVolumeCapacity())
                .status("AVAILABLE")
                .currentMileage(dto.getCurrentMileage() != null ? dto.getCurrentMileage() : 0.0)
                .fuelEfficiency(dto.getFuelEfficiency())
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return VehicleResponse.from(savedVehicle);
    }

    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.getLicensePlate().equals(dto.getLicensePlate())) {
            if (vehicleRepository.findByLicensePlate(dto.getLicensePlate()).isPresent()) {
                throw new BusinessException("Vehicle with license plate already exists");
            }
        }

        vehicle.setLicensePlate(dto.getLicensePlate());
        vehicle.setVehicleType(dto.getVehicleType());
        vehicle.setBrand(dto.getBrand());
        vehicle.setModel(dto.getModel());
        vehicle.setYear(dto.getYear());
        vehicle.setCapacity(dto.getCapacity());
        vehicle.setVolumeCapacity(dto.getVolumeCapacity());
        vehicle.setFuelEfficiency(dto.getFuelEfficiency());

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return VehicleResponse.from(savedVehicle);
    }

    @Transactional
    public VehicleResponse updateMileage(Long id, Double mileage) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        vehicle.setCurrentMileage(mileage);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return VehicleResponse.from(savedVehicle);
    }

    @Transactional
    public VehicleResponse recordMaintenance(Long id, MaintenanceDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        vehicle.setLastMaintenanceDate(LocalDateTime.now());
        vehicle.setNextMaintenanceDate(dto.getNextMaintenanceDate());
        vehicle.setStatus("AVAILABLE");

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return VehicleResponse.from(savedVehicle);
    }

    @Transactional
    public VehicleResponse assignDriver(Long vehicleId, Long driverId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        if (!"AVAILABLE".equals(vehicle.getStatus())) {
            throw new BusinessException("Vehicle is not available");
        }

        vehicle.setCurrentDriver(driver);
        vehicle.setStatus("IN_USE");

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return VehicleResponse.from(savedVehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if ("IN_USE".equals(vehicle.getStatus())) {
            throw new BusinessException("Cannot delete vehicle that is in use");
        }

        vehicle.setStatus("BROKEN");
        vehicleRepository.save(vehicle);
    }
}
