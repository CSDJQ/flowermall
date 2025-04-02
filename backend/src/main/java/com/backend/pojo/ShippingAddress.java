package com.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddress {
    private Integer addressId;
    private Integer cusId;
    private String receiverName;
    private String receiverPhone;
    private String district;
    private String detailedAddress;
    private Boolean isDefault;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}