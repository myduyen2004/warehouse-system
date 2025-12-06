package com.warehousebackend.repository;

import com.warehousebackend.entity.Attendance;
import com.warehousebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Tìm attendance theo user và ngày
    @Query("SELECT a FROM Attendance a WHERE a.user = :user " +
            "AND DATE(a.checkInTime) = DATE(:date)")
    Optional<Attendance> findByUserAndDate(@Param("user") User user,
                                           @Param("date") LocalDateTime date);

    // Tìm attendance chưa check out
    @Query("SELECT a FROM Attendance a WHERE a.user = :user " +
            "AND a.checkOutTime IS NULL ORDER BY a.checkInTime DESC")
    Optional<Attendance> findLatestUncheckedOut(@Param("user") User user);

    // Lấy attendance của user trong khoảng thời gian
    @Query("SELECT a FROM Attendance a WHERE a.user = :user " +
            "AND a.checkInTime BETWEEN :startDate AND :endDate " +
            "ORDER BY a.checkInTime DESC")
    List<Attendance> findByUserAndDateRange(@Param("user") User user,
                                            @Param("startDate") LocalDateTime startDate,
                                            @Param("endDate") LocalDateTime endDate);

    // Lấy tất cả attendance trong ngày (cho manager)
    @Query("SELECT a FROM Attendance a " +
            "WHERE DATE(a.checkInTime) = DATE(:date) " +
            "ORDER BY a.checkInTime DESC")
    List<Attendance> findAllByDate(@Param("date") LocalDateTime date);

    // Lấy attendance theo status
    @Query("SELECT a FROM Attendance a WHERE a.status = :status " +
            "AND DATE(a.checkInTime) = DATE(:date)")
    List<Attendance> findByStatusAndDate(@Param("status") String status,
                                         @Param("date") LocalDateTime date);

    // Thống kê số giờ làm việc của user trong tháng
    @Query("SELECT SUM(TIMESTAMPDIFF(HOUR, a.checkInTime, a.checkOutTime)) " +
            "FROM Attendance a WHERE a.user = :user " +
            "AND MONTH(a.checkInTime) = :month AND YEAR(a.checkInTime) = :year")
    Double getTotalWorkingHours(@Param("user") User user,
                                @Param("month") int month,
                                @Param("year") int year);
}