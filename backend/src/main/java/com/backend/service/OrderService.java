package com.backend.service;

import com.backend.pojo.Order;
import com.backend.pojo.OrderStatusLog;

import java.util.List;
import java.util.Map;

public interface OrderService {
    // 提交订单
    String submitOrder(Order order);

    // 更新订单状态
    void updateOrderStatus(String orderNumber, String newStatus);

    // 管理员获取订单列表（带筛选和分页）
    Map<String, Object> getAdminOrderList(String status, String search,
                                          String startTime, String endTime,
                                          String sortField, String sortOrder,
                                          Integer page, Integer pageSize);

    // 普通用户获取订单列表，添加筛选和排序
    List<Order> getOrderListByUserId(Integer userId, String status,
                                     String sortField, String sortOrder);

    // 计数方法
    int countAdminOrders(String status, String search,
                         String startTime, String endTime);
    /**
     * 获取订单详情
     * @param orderNumber 订单编号
     * @param userId 用户ID
     * @param isAdmin 是否是管理员
     * @return 订单详情，如果订单不存在或无权限返回null
     */
    Order getOrderDetail(String orderNumber, Integer userId, boolean isAdmin);

    List<OrderStatusLog> getOrderStatusLogs(String orderNumber, Integer userId, boolean isAdmin);
}