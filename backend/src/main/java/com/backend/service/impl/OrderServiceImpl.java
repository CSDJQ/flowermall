package com.backend.service.impl;

import com.backend.mapper.OrderMapper;
import com.backend.pojo.Order;
import com.backend.pojo.OrderItem;
import com.backend.pojo.OrderStatusLog;
import com.backend.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "created_at", "delivery_time", "total_amount", "status"
    );

    @Autowired
    private OrderMapper orderMapper;

    @Override
    @Transactional
    public String submitOrder(Order order) {
        // 生成订单编号
        String orderNumber = generateOrderNumber();
        order.setOrderNumber(orderNumber);
        order.setStatus("制作中");
        order.setPaymentTime(new Date());
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());

        // 计算总金额并设置商品项
        calculateOrderTotal(order);

        // 保存订单
        saveOrderWithItems(order);

        log.info("订单创建成功: orderNumber={}", orderNumber);
        return orderNumber;
    }

    @Override
    public void updateOrderStatus(String orderNumber, String newStatus) {
        Order order = orderMapper.getOrderByNumber(orderNumber);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        updateOrderStatusAndTimestamps(orderNumber, newStatus);
        log.info("订单状态更新: orderNumber={}, newStatus={}", orderNumber, newStatus);
    }

    @Override
    public List<Order> getOrderListByUserId(Integer userId, String status,
                                            String sortField, String sortOrder) {
        String validSortField = validateSortField(sortField);
        String validSortOrder = validateSortOrder(sortOrder);

        List<Order> orders = orderMapper.getOrdersByUserIdWithFilter(
                userId, status, validSortField, validSortOrder);

        return enrichOrdersWithItems(orders);
    }

    @Override
    public Order getOrderDetail(String orderNumber, Integer userId, boolean isAdmin) {
        // 1. 获取订单基本信息
        Order order = orderMapper.getOrderDetail(orderNumber);
        if (order == null) {
            return null;
        }

        // 2. 权限验证：管理员可以查看所有订单，普通用户只能查看自己的订单
        if (!isAdmin && !order.getCusId().equals(userId)) {
            return null;
        }

        // 3. 获取订单商品项
        List<OrderItem> items = orderMapper.getOrderItems(order.getOrderId());
        order.setItems(items);

        // 4. 获取收货地址信息（已在orderMapper.getOrderDetail中通过关联查询获取）

        return order;
    }

    @Override
    public Map<String, Object> getAdminOrderList(String status, String search,
                                                 String startTime, String endTime,
                                                 String sortField, String sortOrder,
                                                 Integer page, Integer pageSize) {
        int offset = (page - 1) * pageSize;
        String validSortField = validateSortField(sortField);
        String validSortOrder = validateSortOrder(sortOrder);

        List<Order> orders = orderMapper.getAdminOrders(
                status, search, startTime, endTime,
                validSortField, validSortOrder, offset, pageSize);

        int total = orderMapper.countAdminOrders(status, search, startTime, endTime);

        return Map.of(
                "list", enrichOrdersWithItems(orders),
                "total", total,
                "page", page,
                "pageSize", pageSize
        );
    }

    @Override
    public int countAdminOrders(String status, String search,
                                String startTime, String endTime) {
        return orderMapper.countAdminOrders(status, search, startTime, endTime);
    }

    @Override
    public List<OrderStatusLog> getOrderStatusLogs(String orderNumber, Integer userId, boolean isAdmin) {
        Order order = orderMapper.getOrderByNumber(orderNumber);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        // 权限验证
        if (!isAdmin && !order.getCusId().equals(userId)) {
            throw new RuntimeException("无权限查看此订单状态日志");
        }

        return orderMapper.getStatusLogsByOrderId(order.getOrderId());
    }

    // ========== 私有方法 ==========

    private String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis() +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private void calculateOrderTotal(Order order) {
        BigDecimal totalAmount = order.getItems().stream()
                .map(item -> {
                    BigDecimal price = item.getDiscountPrice() != null ?
                            item.getDiscountPrice() : item.getUnitPrice();
                    item.setSubtotal(price.multiply(BigDecimal.valueOf(item.getQuantity())));
                    return item.getSubtotal();
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(totalAmount);
    }

    private void saveOrderWithItems(Order order) {
        orderMapper.insertOrder(order);
        order.getItems().forEach(item -> {
            item.setOrderId(order.getOrderId());
            orderMapper.insertOrderItem(item);
        });
    }

    private void updateOrderStatusAndTimestamps(String orderNumber, String newStatus) {
        // 获取原订单信息
        Order order = orderMapper.getOrderByNumber(orderNumber);
        if (order == null) {
            throw new RuntimeException("订单不存在");
        }

        // 记录原状态
        String fromStatus = order.getStatus();

        // 更新订单状态
        orderMapper.updateOrderStatus(orderNumber, newStatus);

        // 记录状态变更日志
        orderMapper.insertStatusLog(
                order.getOrderId(),
                fromStatus,
                newStatus
        );

        // 根据状态更新相应时间
        switch (newStatus) {
            case "待配送":
                orderMapper.updateShippingTime(orderNumber, new Date());
                break;
            case "配送中":
                orderMapper.updateDeliveryStartTime(orderNumber, new Date()); // 假设新增了配送开始时间字段
                break;
            case "已送达":
                orderMapper.updateCompletedTime(orderNumber, new Date());
                break;
        }
    }

    private List<Order> enrichOrdersWithItems(List<Order> orders) {
        return orders.stream().peek(order -> {
            List<OrderItem> items = orderMapper.getOrderItems(order.getOrderId());
            order.setItems(items);
        }).collect(Collectors.toList());
    }

    private String validateSortField(String sortField) {
        if (sortField == null || !ALLOWED_SORT_FIELDS.contains(sortField.toLowerCase())) {
            return "created_at";
        }
        return sortField;
    }

    private String validateSortOrder(String sortOrder) {
        return "desc".equalsIgnoreCase(sortOrder) ? "DESC" : "ASC";
    }
}