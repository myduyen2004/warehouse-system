package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.product.*;
import com.warehousebackend.entity.Product;
import com.warehousebackend.entity.Supplier;
import com.warehousebackend.exception.BusinessException;
import com.warehousebackend.exception.ResourceNotFoundException;
import com.warehousebackend.repository.ProductRepository;
import com.warehousebackend.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    public Page<ProductResponse> getAllProducts(String category, String keyword, Pageable pageable) {
        Page<Product> products;

        if (keyword != null && !keyword.isEmpty()) {
            products = productRepository.searchByName(keyword, pageable);
        } else if (category != null && !category.isEmpty()) {
            products = productRepository.findAll(
                    (root, query, cb) -> cb.equal(root.get("category"), category),
                    pageable
            );
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(ProductResponse::from);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductDTO dto) {
        if (productRepository.findBySku(dto.getSku()).isPresent()) {
            throw new BusinessException("Product with SKU " + dto.getSku() + " already exists");
        }

        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        Product product = Product.builder()
                .name(dto.getName())
                .sku(dto.getSku())
                .category(dto.getCategory())
                .brand(dto.getBrand())
                .price(dto.getPrice())
                .costPrice(dto.getCostPrice())
                .unit(dto.getUnit())
                .weight(dto.getWeight())
                .length(dto.getLength())
                .width(dto.getWidth())
                .height(dto.getHeight())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .status("ACTIVE")
                .supplier(supplier)
                .build();

        Product savedProduct = productRepository.save(product);
        return ProductResponse.from(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check SKU uniqueness if changed
        if (!product.getSku().equals(dto.getSku())) {
            if (productRepository.findBySku(dto.getSku()).isPresent()) {
                throw new BusinessException("Product with SKU " + dto.getSku() + " already exists");
            }
        }

        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

        product.setName(dto.getName());
        product.setSku(dto.getSku());
        product.setCategory(dto.getCategory());
        product.setBrand(dto.getBrand());
        product.setPrice(dto.getPrice());
        product.setCostPrice(dto.getCostPrice());
        product.setUnit(dto.getUnit());
        product.setWeight(dto.getWeight());
        product.setLength(dto.getLength());
        product.setWidth(dto.getWidth());
        product.setHeight(dto.getHeight());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        product.setSupplier(supplier);

        Product savedProduct = productRepository.save(product);
        return ProductResponse.from(savedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStatus("INACTIVE");
        productRepository.save(product);
    }
}