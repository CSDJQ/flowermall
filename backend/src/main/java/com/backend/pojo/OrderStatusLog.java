package com.backend.pojo;

import lombok.Data;
import java.util.Date;

@Data
public class OrderStatusLog {
    private Integer logId;
    private Integer orderId;
    private String fromStatus;
    private String toStatus;
    private String note;
    private Date createdAt;
}