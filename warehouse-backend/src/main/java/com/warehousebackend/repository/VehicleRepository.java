package com.warehousebackend.repository;

import com.warehousebackend.entity.User;
import com.warehousebackend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * @author MyDuyen
 */

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByLicensePlate(String licensePlate);
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByVehicleType(String vehicleType);
    List<Vehicle> findByCurrentDriver(User driver);

    @Query("SELECT v FROM Vehicle v WHERE v.nextMaintenanceDate < :date")
    List<Vehicle> findVehiclesNeedingMaintenance(@Param("date") LocalDateTime date);
}