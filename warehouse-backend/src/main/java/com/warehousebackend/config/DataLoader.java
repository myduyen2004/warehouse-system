package com.warehousebackend.config;

import com.warehousebackend.entity.*;
import com.warehousebackend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting data initialization...");

        // Check if data already exists
        if (userRepository.count() > 0) {
            log.info("Data already exists, skipping initialization");
            return;
        }

        try {
            loadUsers();
            loadWarehouses();
            loadSuppliers();
            loadProducts();

            log.info("Data initialization completed successfully!");
        } catch (Exception e) {
            log.error("Error during data initialization", e);
        }
    }

    private void loadUsers() {
        log.info("Loading users...");

        // Admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@warehouse.com");
        admin.setFullName("System Administrator");
        admin.setPhoneNumber("0123456789");
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);
        admin.setAccountNonLocked(true);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        userRepository.save(admin);

        // Manager user
        User manager = new User();
        manager.setUsername("manager");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setEmail("manager@warehouse.com");
        manager.setFullName("Warehouse Manager");
        manager.setPhoneNumber("0987654321");
        manager.setRole(Role.MANAGER);
        manager.setEnabled(true);
        manager.setAccountNonLocked(true);
        manager.setCreatedAt(LocalDateTime.now());
        manager.setUpdatedAt(LocalDateTime.now());
        userRepository.save(manager);

        if (!userRepository.existsByUsername("staff")) {
            User staff = new User();
            staff.setUsername("staff");
            staff.setPassword(passwordEncoder.encode("staff123"));
            staff.setEmail("staff@warehouse.com");
            staff.setFullName("Warehouse Staff");
            staff.setPhoneNumber("0987654378");
            staff.setRole(Role.WAREHOUSE_STAFF);
            staff.setEnabled(true);
            staff.setAccountNonLocked(true);
            staff.setCreatedAt(LocalDateTime.now());
            staff.setUpdatedAt(LocalDateTime.now());
            userRepository.save(staff);
            log.info("Added staff user");
        } else {
            log.info("Staff user already exists, skipping");
        }

        log.info("Loaded {} users", userRepository.count());
    }

    private void loadWarehouses() {
        log.info("Loading warehouses...");

        // Hanoi warehouse
        Warehouse hanoi = new Warehouse();
        hanoi.setName("Kho Ha Noi");
        hanoi.setAddress("123 Duong Lang, Dong Da");
        hanoi.setCity("Ha Noi");
        hanoi.setDistrict("Dong Da");
        hanoi.setLatitude(21.0285);
        hanoi.setLongitude(105.8542);
        hanoi.setCapacity(10000);
        hanoi.setCurrentUsage(0);
        hanoi.setStatus("ACTIVE");
        hanoi.setPhoneNumber("0241234567");
        hanoi.setManagerName("Nguyen Van A");
        hanoi.setCreatedAt(LocalDateTime.now());
        hanoi.setUpdatedAt(LocalDateTime.now());
        warehouseRepository.save(hanoi);

        // HCMC warehouse
        Warehouse hcmc = new Warehouse();
        hcmc.setName("Kho TP.HCM");
        hcmc.setAddress("456 Nguyen Hue, Quan 1");
        hcmc.setCity("Ho Chi Minh");
        hcmc.setDistrict("Quan 1");
        hcmc.setLatitude(10.7769);
        hcmc.setLongitude(106.7009);
        hcmc.setCapacity(15000);
        hcmc.setCurrentUsage(0);
        hcmc.setStatus("ACTIVE");
        hcmc.setPhoneNumber("0281234567");
        hcmc.setManagerName("Tran Thi B");
        hcmc.setCreatedAt(LocalDateTime.now());
        hcmc.setUpdatedAt(LocalDateTime.now());
        warehouseRepository.save(hcmc);

        log.info("Loaded {} warehouses", warehouseRepository.count());
    }

    private void loadSuppliers() {
        log.info("Loading suppliers...");

        Supplier supplier = new Supplier();
        supplier.setName("Cong ty ABC");
        supplier.setCode("SUP001");
        supplier.setContactPerson("Nguyen Van X");
        supplier.setEmail("contact@abc.com");
        supplier.setPhoneNumber("0912345678");
        supplier.setAddress("100 Nguyen Trai, Ha Noi");
        supplier.setTaxCode("0123456789");
        supplier.setStatus("ACTIVE");
        supplier.setRating(4.5);
        supplier.setCreatedAt(LocalDateTime.now());
        supplier.setUpdatedAt(LocalDateTime.now());
        supplierRepository.save(supplier);

        log.info("Loaded {} suppliers", supplierRepository.count());
    }

    private void loadProducts() {
        log.info("Loading products...");

        Supplier supplier = supplierRepository.findAll().get(0);

        for (int i = 1; i <= 20; i++) {
            Product product = new Product();
            product.setName("Product " + i);
            product.setSku(String.format("SKU%05d", i));

            // Set category
            if (i % 3 == 0) {
                product.setCategory("Electronics");
            } else if (i % 3 == 1) {
                product.setCategory("Clothing");
            } else {
                product.setCategory("Food");
            }

            product.setBrand("Brand " + ((i % 3) + 1));
            product.setPrice(BigDecimal.valueOf(i * 50000));
            product.setCostPrice(BigDecimal.valueOf(i * 35000));
            product.setUnit("PIECE");
            product.setWeight(i * 0.5);
            product.setDescription("Description for product " + i);
            product.setStatus("ACTIVE");
            product.setSupplier(supplier);
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());

            productRepository.save(product);
        }

        log.info("Loaded {} products", productRepository.count());
    }
}