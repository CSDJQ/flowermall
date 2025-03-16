package com.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flower {
    private Integer flowerId;
    private String name;
    private String description;
    private Double originalPrice;
    private Double discountPrice;
    private Boolean isOnSale;
    private String imageUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}