package com.warehousebackend.repository;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByCode(String code);
    List<Supplier> findByStatus(String status);

    @Query("SELECT s FROM Supplier s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Supplier> searchByName(@Param("keyword") String keyword);

    @Query("SELECT s FROM Supplier s WHERE s.rating >= :minRating ORDER BY s.rating DESC")
    List<Supplier> findTopRatedSuppliers(@Param("minRating") Double minRating);
}