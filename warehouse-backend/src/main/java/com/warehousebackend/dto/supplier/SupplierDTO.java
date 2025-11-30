package com.warehousebackend.dto.supplier;

/**
 * @author MyDuyen
 */

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupplierDTO {
    @NotBlank(message = "Supplier name is required")
    private String name;

    @NotBlank(message = "Supplier code is required")
    private String code;

    private String contactPerson;

    @Email(message = "Email should be valid")
    private String email;

    private String phoneNumber;
    private String address;
    private String taxCode;
    private String description;
}
