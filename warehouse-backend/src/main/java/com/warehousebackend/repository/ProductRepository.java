package com.warehousebackend.repository;

import com.warehousebackend.entity.Product;
import com.warehousebackend.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * @author MyDuyen
 */

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySku(String sku);
    List<Product> findByCategory(String category);
    List<Product> findBySupplier(Supplier supplier);
    List<Product> findByStatus(String status);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:name%")
    Page<Product> searchByName(@Param("name") String name, Pageable pageable);
    Page<Product> findAll(Pageable pageable);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findBySkuContainingIgnoreCase(String keyword);
    Page<Product> findByCategory(String category, Pageable pageable);
    List<Product> findAllByOrderByStockQuantityDesc(Pageable pageable);
}