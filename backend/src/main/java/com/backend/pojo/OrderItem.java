package com.backend.pojo;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItem {
    private Integer itemId;
    private Integer orderId;
    private Integer flowerId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal discountPrice;
    private BigDecimal subtotal;

    private String name;
    private String imageUrl;
}
