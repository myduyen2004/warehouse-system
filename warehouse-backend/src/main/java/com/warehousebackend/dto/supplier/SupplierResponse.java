package com.warehousebackend.dto.supplier;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierResponse {
    private Long id;
    private String name;
    private String code;
    private String contactPerson;
    private String email;
    private String phoneNumber;
    private String address;
    private String taxCode;
    private String status;
    private String description;
    private Double rating;
    private LocalDateTime createdAt;

    public static SupplierResponse from(Supplier supplier) {
        return SupplierResponse.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .code(supplier.getCode())
                .contactPerson(supplier.getContactPerson())
                .email(supplier.getEmail())
                .phoneNumber(supplier.getPhoneNumber())
                .address(supplier.getAddress())
                .taxCode(supplier.getTaxCode())
                .status(supplier.getStatus())
                .description(supplier.getDescription())
                .rating(supplier.getRating())
                .createdAt(supplier.getCreatedAt())
                .build();
    }
}