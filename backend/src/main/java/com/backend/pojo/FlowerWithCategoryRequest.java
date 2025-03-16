package com.backend.pojo;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlowerWithCategoryRequest {
    private Integer categoryId;
    private String name;
    private String description;
    private Double originalPrice;
    private Double discountPrice;
    private Boolean isOnSale;
    private String imageUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Integer flowerId;
    private String mainFlower;
    private String purpose;
    private String colorScheme;
    private Integer stemCount;
}
