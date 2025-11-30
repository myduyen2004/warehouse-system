package com.warehousebackend.repository;

import com.warehousebackend.entity.Role;
import com.warehousebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * @author MyDuyen
 */

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
