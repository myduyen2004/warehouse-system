package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.supplier.*;
import com.warehousebackend.entity.Supplier;
import com.warehousebackend.exception.BusinessException;
import com.warehousebackend.exception.ResourceNotFoundException;
import com.warehousebackend.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public Page<SupplierResponse> getAllSuppliers(Pageable pageable) {
        return supplierRepository.findAll(pageable)
                .map(SupplierResponse::from);
    }

    public List<SupplierResponse> getActiveSuppliers() {
        return supplierRepository.findByStatus("ACTIVE").stream()
                .map(SupplierResponse::from)
                .collect(Collectors.toList());
    }

    public SupplierResponse getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        return SupplierResponse.from(supplier);
    }

    public List<SupplierResponse> searchSuppliers(String keyword) {
        return supplierRepository.searchByName(keyword).stream()
                .map(SupplierResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupplierResponse createSupplier(SupplierDTO dto) {
        if (supplierRepository.findByCode(dto.getCode()).isPresent()) {
            throw new BusinessException("Supplier code already exists");
        }

        Supplier supplier = Supplier.builder()
                .name(dto.getName())
                .code(dto.getCode())
                .contactPerson(dto.getContactPerson())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .taxCode(dto.getTaxCode())
                .status("ACTIVE")
                .description(dto.getDescription())
                .rating(0.0)
                .build();

        Supplier savedSupplier = supplierRepository.save(supplier);
        return SupplierResponse.from(savedSupplier);
    }

    @Transactional
    public SupplierResponse updateSupplier(Long id, SupplierDTO dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        if (!supplier.getCode().equals(dto.getCode())) {
            if (supplierRepository.findByCode(dto.getCode()).isPresent()) {
                throw new BusinessException("Supplier code already exists");
            }
        }

        supplier.setName(dto.getName());
        supplier.setCode(dto.getCode());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setEmail(dto.getEmail());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setAddress(dto.getAddress());
        supplier.setTaxCode(dto.getTaxCode());
        supplier.setDescription(dto.getDescription());

        Supplier savedSupplier = supplierRepository.save(supplier);
        return SupplierResponse.from(savedSupplier);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        supplier.setStatus("INACTIVE");
        supplierRepository.save(supplier);
    }

    @Transactional
    public SupplierResponse updateRating(Long id, Double rating) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        if (rating < 0.0 || rating > 5.0) {
            throw new BusinessException("Rating must be between 0.0 and 5.0");
        }

        supplier.setRating(rating);
        Supplier savedSupplier = supplierRepository.save(supplier);
        return SupplierResponse.from(savedSupplier);
    }
}