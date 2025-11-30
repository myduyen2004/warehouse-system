package com.warehousebackend.repository;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Inventory;
import com.warehousebackend.entity.InventoryTransaction;
import com.warehousebackend.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByInventory(Inventory inventory);
    List<InventoryTransaction> findByType(TransactionType type);

    @Query("SELECT it FROM InventoryTransaction it WHERE it.transactionDate BETWEEN :start AND :end")
    List<InventoryTransaction> findByDateRange(@Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end);

    @Query("SELECT it FROM InventoryTransaction it WHERE it.inventory.id = :inventoryId ORDER BY it.transactionDate DESC")
    List<InventoryTransaction> findRecentTransactions(@Param("inventoryId") Long inventoryId);
}