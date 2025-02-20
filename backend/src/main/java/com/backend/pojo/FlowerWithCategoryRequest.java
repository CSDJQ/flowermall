package com.backend.pojo;

import java.sql.Timestamp;
import lombok.Data;

@Data
public class Flower {
    private Integer categoryId;
    private String name;
    private String description;
    private Double originalPrice;
    private Double discountPrice;
    private Boolean isOnSale;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Integer flowerId;
    private String mainFlower;
    private String purpose;
    private String colorScheme;
    private Integer stemCount;
}
