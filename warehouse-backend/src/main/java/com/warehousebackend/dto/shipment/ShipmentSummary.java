package com.warehousebackend.dto.shipment;

/**
 * @author MyDuyen
 */

import com.warehousebackend.entity.Shipment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentSummary {
    private Long id;
    private String trackingNumber;
    private String status;
    private LocalDateTime estimatedDeliveryTime;

    public static ShipmentSummary from(Shipment shipment) {
        return ShipmentSummary.builder()
                .id(shipment.getId())
                .trackingNumber(shipment.getTrackingNumber())
                .status(shipment.getStatus().name())
                .estimatedDeliveryTime(shipment.getEstimatedDeliveryTime())
                .build();
    }
}