package com.warehousebackend.service;

/**
 * @author MyDuyen
 */

import com.warehousebackend.dto.inventory.*;
import com.warehousebackend.entity.*;
import com.warehousebackend.exception.BusinessException;
import com.warehousebackend.exception.ResourceNotFoundException;
import com.warehousebackend.repository.*;
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
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryTransactionRepository transactionRepository;

    @Transactional
    public InventoryResponse stockIn(StockDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        // Get or create inventory
        Inventory inventory = inventoryRepository
                .findByProductAndWarehouse(product, warehouse)
                .orElse(Inventory.builder()
                        .product(product)
                        .warehouse(warehouse)
                        .quantity(0)
                        .reservedQuantity(0)
                        .minThreshold(10)
                        .maxThreshold(1000)
                        .build());

        Integer beforeQuantity = inventory.getQuantity();
        inventory.setQuantity(inventory.getQuantity() + dto.getQuantity());
        inventory.setLastStockIn(LocalDateTime.now());

        if (dto.getLocation() != null) {
            inventory.setLocation(dto.getLocation());
        }
        if (dto.getBatchNumber() != null) {
            inventory.setBatchNumber(dto.getBatchNumber());
        }

        Inventory savedInventory = inventoryRepository.save(inventory);

        // Record transaction
        recordTransaction(inventory, TransactionType.STOCK_IN, dto.getQuantity(),
                beforeQuantity, savedInventory.getQuantity(), dto.getReferenceNumber(), dto.getNotes());

        return InventoryResponse.from(savedInventory);
    }

    @Transactional
    public InventoryResponse stockOut(StockDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        Inventory inventory = inventoryRepository
                .findByProductAndWarehouse(product, warehouse)
                .orElseThrow(() -> new BusinessException("Inventory not found"));

        if (inventory.getAvailableQuantity() < dto.getQuantity()) {
            throw new BusinessException("Insufficient stock. Available: " +
                    inventory.getAvailableQuantity() + ", Requested: " + dto.getQuantity());
        }

        Integer beforeQuantity = inventory.getQuantity();
        inventory.setQuantity(inventory.getQuantity() - dto.getQuantity());
        inventory.setLastStockOut(LocalDateTime.now());

        Inventory savedInventory = inventoryRepository.save(inventory);

        // Record transaction
        recordTransaction(inventory, TransactionType.STOCK_OUT, dto.getQuantity(),
                beforeQuantity, savedInventory.getQuantity(), dto.getReferenceNumber(), dto.getNotes());

        return InventoryResponse.from(savedInventory);
    }

    @Transactional
    public void transferStock(StockTransferDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Warehouse fromWarehouse = warehouseRepository.findById(dto.getFromWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("From warehouse not found"));

        Warehouse toWarehouse = warehouseRepository.findById(dto.getToWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("To warehouse not found"));

        // Stock out from source
        Inventory fromInventory = inventoryRepository
                .findByProductAndWarehouse(product, fromWarehouse)
                .orElseThrow(() -> new BusinessException("Source inventory not found"));

        if (fromInventory.getAvailableQuantity() < dto.getQuantity()) {
            throw new BusinessException("Insufficient stock in source warehouse");
        }

        Integer fromBefore = fromInventory.getQuantity();
        fromInventory.setQuantity(fromInventory.getQuantity() - dto.getQuantity());
        inventoryRepository.save(fromInventory);

        recordTransaction(fromInventory, TransactionType.TRANSFER, dto.getQuantity(),
                fromBefore, fromInventory.getQuantity(), "TRANSFER-OUT", dto.getNotes());

        // Stock in to destination
        Inventory toInventory = inventoryRepository
                .findByProductAndWarehouse(product, toWarehouse)
                .orElse(Inventory.builder()
                        .product(product)
                        .warehouse(toWarehouse)
                        .quantity(0)
                        .reservedQuantity(0)
                        .minThreshold(10)
                        .maxThreshold(1000)
                        .build());

        Integer toBefore = toInventory.getQuantity();
        toInventory.setQuantity(toInventory.getQuantity() + dto.getQuantity());
        inventoryRepository.save(toInventory);

        recordTransaction(toInventory, TransactionType.TRANSFER, dto.getQuantity(),
                toBefore, toInventory.getQuantity(), "TRANSFER-IN", dto.getNotes());
    }

    public List<InventoryResponse> getLowStockAlert() {
        return inventoryRepository.findLowStockItems().stream()
                .map(InventoryResponse::from)
                .collect(Collectors.toList());
    }

    public Page<InventoryResponse> getAllInventory(Pageable pageable) {
        return inventoryRepository.findAll(pageable)
                .map(InventoryResponse::from);
    }

    public List<InventoryResponse> getInventoryByWarehouse(Long warehouseId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        return inventoryRepository.findByWarehouse(warehouse).stream()
                .map(InventoryResponse::from)
                .collect(Collectors.toList());
    }

    private void recordTransaction(Inventory inventory, TransactionType type,
                                   Integer quantity, Integer before, Integer after,
                                   String reference, String notes) {
        InventoryTransaction transaction = InventoryTransaction.builder()
                .inventory(inventory)
                .type(type)
                .quantity(quantity)
                .beforeQuantity(before)
                .afterQuantity(after)
                .referenceNumber(reference)
                .notes(notes)
                .build();

        transactionRepository.save(transaction);
    }
}