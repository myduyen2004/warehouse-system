package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.warehouse.*;
import com.warehousebackend.entity.Warehouse;
import com.warehousebackend.exception.BusinessException;
import com.warehousebackend.exception.ResourceNotFoundException;
import com.warehousebackend.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public Page<WarehouseResponse> getAllWarehouses(Pageable pageable) {
        return warehouseRepository.findAll(pageable)
                .map(WarehouseResponse::from);
    }

    public List<WarehouseResponse> getAvailableWarehouses() {
        return warehouseRepository.findAvailableWarehouses().stream()
                .map(WarehouseResponse::from)
                .collect(Collectors.toList());
    }

    public WarehouseResponse getWarehouseById(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        return WarehouseResponse.from(warehouse);
    }

    @Transactional
    public WarehouseResponse createWarehouse(WarehouseDTO dto) {
        Warehouse warehouse = Warehouse.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .city(dto.getCity())
                .district(dto.getDistrict())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .capacity(dto.getCapacity())
                .currentUsage(0)
                .status("ACTIVE")
                .phoneNumber(dto.getPhoneNumber())
                .managerName(dto.getManagerName())
                .description(dto.getDescription())
                .build();

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        return WarehouseResponse.from(savedWarehouse);
    }

    @Transactional
    public WarehouseResponse updateWarehouse(Long id, WarehouseDTO dto) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        warehouse.setName(dto.getName());
        warehouse.setAddress(dto.getAddress());
        warehouse.setCity(dto.getCity());
        warehouse.setDistrict(dto.getDistrict());
        warehouse.setLatitude(dto.getLatitude());
        warehouse.setLongitude(dto.getLongitude());
        warehouse.setCapacity(dto.getCapacity());
        warehouse.setPhoneNumber(dto.getPhoneNumber());
        warehouse.setManagerName(dto.getManagerName());
        warehouse.setDescription(dto.getDescription());

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);
        return WarehouseResponse.from(savedWarehouse);
    }

    @Transactional
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        if (warehouse.getCurrentUsage() > 0) {
            throw new BusinessException("Cannot delete warehouse with active inventory");
        }

        warehouse.setStatus("INACTIVE");
        warehouseRepository.save(warehouse);
    }
}