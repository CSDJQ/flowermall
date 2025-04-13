package com.backend.pojo;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class Order {
    private Integer orderId;
    private String orderNumber;
    private Integer cusId;
    private Integer addressId;
    private String status; // 制作中/待配送/已送达
    private BigDecimal totalAmount;
    private String paymentMethod;
    private Date paymentTime;
    private Date deliveryTime;
    private Date shippingTime;
    private Date completedTime;
    private String remark;
    private Date createdAt;
    private Date updatedAt;

    // 关联字段
    private ShippingAddress shippingAddress;
    private List<OrderItem> items;

    private List<OrderStatusLog> statusLogs;
}
