package com.warehousebackend.dto.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
* @author MyDuyen
*/

// Attendance statistics
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceStatistics {
    private Integer totalDays;
    private Integer presentDays;
    private Integer absentDays;
    private Integer lateDays;
    private Integer earlyLeaveDays;
    private Double totalWorkingHours;
    private Double averageWorkingHours;
}