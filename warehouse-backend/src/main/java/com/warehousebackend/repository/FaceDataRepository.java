package com.warehousebackend.repository;

import com.warehousebackend.entity.FaceData;
import com.warehousebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaceDataRepository extends JpaRepository<FaceData, Long> {

    Optional<FaceData> findByUser(User user);

    Optional<FaceData> findByUserId(Long userId);

    List<FaceData> findAllByIsActiveTrue();

    boolean existsByUser(User user);
    boolean existsByUserId(Long userId);
}