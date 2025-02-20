package com.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    private Integer categoryId;
    private Integer flowerId;
    private String mainFlower;
    private String purpose;
    private String colorScheme;
    private Integer stemCount;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
