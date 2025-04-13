package com.backend.mapper;

import com.backend.pojo.Order;
import com.backend.pojo.OrderItem;
import com.backend.pojo.OrderStatusLog;
import org.apache.ibatis.annotations.*;

import java.util.Date;
import java.util.List;

@Mapper
public interface OrderMapper {
    @Insert("INSERT INTO `order` (order_number, cus_id, address_id, status, total_amount, " +
            "payment_method, payment_time, delivery_time, remark, created_at, updated_at) " +
            "VALUES (#{orderNumber}, #{cusId}, #{addressId}, #{status}, #{totalAmount}, " +
            "#{paymentMethod}, #{paymentTime}, #{deliveryTime}, #{remark}, #{createdAt}, #{updatedAt})")
    @Options(useGeneratedKeys = true, keyProperty = "orderId")
    void insertOrder(Order order);

    @Insert("INSERT INTO order_item (order_id, flower_id, quantity, unit_price, discount_price, subtotal) " +
            "VALUES (#{orderId}, #{flowerId}, #{quantity}, #{unitPrice}, #{discountPrice}, #{subtotal})")
    void insertOrderItem(OrderItem item);

    @Update("UPDATE `order` SET status = #{status}, updated_at = NOW() WHERE order_number = #{orderNumber}")
    void updateOrderStatus(@Param("orderNumber") String orderNumber, @Param("status") String status);

    @Update("UPDATE `order` SET shipping_time = #{shippingTime}, updated_at = NOW() WHERE order_number = #{orderNumber}")
    void updateShippingTime(@Param("orderNumber") String orderNumber, @Param("shippingTime") Date shippingTime);

    @Update("UPDATE `order` SET completed_time = #{completedTime}, updated_at = NOW() WHERE order_number = #{orderNumber}")
    void updateCompletedTime(@Param("orderNumber") String orderNumber, @Param("completedTime") Date completedTime);

    @Update("UPDATE `order` SET delivery_start_time = #{deliveryStartTime}, updated_at = NOW() WHERE order_number = #{orderNumber}")
    void updateDeliveryStartTime(@Param("orderNumber") String orderNumber, @Param("deliveryStartTime") Date deliveryStartTime);

    @Select("SELECT * FROM `order` WHERE order_number = #{orderNumber}")
    Order getOrderByNumber(String orderNumber);

    @Select("SELECT * FROM `order` WHERE cus_id = #{userId}")
    List<Order> getOrdersByUserId(Integer userId);

    // 管理员订单查询方法
    List<Order> getAdminOrders(@Param("status") String status,
                               @Param("search") String search,
                               @Param("startTime") String startTime,
                               @Param("endTime") String endTime,
                               @Param("sortField") String sortField,
                               @Param("sortOrder") String sortOrder,
                               @Param("offset") int offset,
                               @Param("pageSize") int pageSize);

    // 计数方法
    int countAdminOrders(@Param("status") String status,
                         @Param("search") String search,
                         @Param("startTime") String startTime,
                         @Param("endTime") String endTime);

    List<Order> getOrdersByUserIdWithFilter(@Param("userId") Integer userId,
                                            @Param("status") String status,
                                            @Param("sortField") String sortField,
                                            @Param("sortOrder") String sortOrder);


    @Select("SELECT o.*, a.* FROM `order` o " +
            "LEFT JOIN shipping_address a ON o.address_id = a.address_id " +
            "WHERE o.order_number = #{orderNumber}")
    @ResultMap("orderResultMap")
    Order getOrderDetail(String orderNumber);

    @Select("SELECT oi.*, f.name, f.image_url FROM order_item oi " +
            "LEFT JOIN flower f ON oi.flower_id = f.flower_id " +
            "WHERE oi.order_id = #{orderId}")
    List<OrderItem> getOrderItems(Integer orderId);

    @Insert("INSERT INTO order_status_log (order_id, from_status, to_status, created_at) " +
            "VALUES (#{orderId}, #{fromStatus}, #{toStatus}, NOW())")
    void insertStatusLog(@Param("orderId") Integer orderId,
                         @Param("fromStatus") String fromStatus,
                         @Param("toStatus") String toStatus);

    @Select("SELECT * FROM order_status_log WHERE order_id = #{orderId} ORDER BY created_at DESC")
    List<OrderStatusLog> getStatusLogsByOrderId(Integer orderId);
}