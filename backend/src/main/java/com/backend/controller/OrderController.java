package com.backend.controller;

import com.backend.pojo.Order;
import com.backend.pojo.Result;
import com.backend.service.OrderService;
import com.backend.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
@Slf4j
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 提交订单
    @PostMapping("/submit")
    public Result submitOrder(@RequestBody Order order,
                              @RequestHeader("Authorization") String token) {
        try {
            token = token.replace("Bearer ", "");
            Claims claims = JwtUtils.parseJWT(token);
            Integer userId = (Integer) claims.get("id");

            log.info("用户提交订单: userId={}", userId);
            order.setCusId(userId);

            String orderNumber = orderService.submitOrder(order);
            return Result.success(orderNumber);
        } catch (Exception e) {
            log.error("订单提交失败", e);
            return Result.error("订单提交失败: " + e.getMessage());
        }
    }

    // 修改订单状态
    @PutMapping("/updateStatus")
    public Result updateOrderStatus(@RequestBody Map<String, String> params,
                                    @RequestHeader("Authorization") String token) {
        try {
            token = token.replace("Bearer ", "");
            Claims claims = JwtUtils.parseJWT(token);
            boolean isAdmin = (boolean) claims.get("isAdmin");

            if (!isAdmin) {
                return Result.error("无权限操作");
            }

            String orderNumber = params.get("orderNumber");
            String newStatus = params.get("status");

            log.info("修改订单状态: orderNumber={}, newStatus={}", orderNumber, newStatus);
            orderService.updateOrderStatus(orderNumber, newStatus);

            return Result.success("订单状态更新成功");
        } catch (Exception e) {
            log.error("订单状态更新失败", e);
            return Result.error("订单状态更新失败: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public Result getOrderList(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortOrder,
            @RequestHeader("Authorization") String token) {

            token = token.replace("Bearer ", "");
            Claims claims = JwtUtils.parseJWT(token);
            Integer userId = (Integer) claims.get("id");
//        Integer userId = JwtUtil.getUserId(token);
        List<Order> orders = orderService.getOrderListByUserId(
                userId, status, sortField, sortOrder);

        return Result.success(orders);
    }

    // 获取订单详情
    @GetMapping("/detail/{orderNumber}")
    public Result getOrderDetail(@PathVariable String orderNumber,
                                 @RequestHeader("Authorization") String token) {
        try {
            token = token.replace("Bearer ", "");
            Claims claims = JwtUtils.parseJWT(token);
            Integer userId = (Integer) claims.get("id");
            boolean isAdmin = (boolean) claims.get("isAdmin");

            log.info("获取订单详情: orderNumber={}, userId={}, isAdmin={}",
                    orderNumber, userId, isAdmin);

            // 获取订单详情
            Order order = orderService.getOrderDetail(orderNumber, userId, isAdmin);

            if (order == null) {
                return Result.error("订单不存在或无权限查看");
            }

            return Result.success(order);
        } catch (Exception e) {
            log.error("获取订单详情失败", e);
            return Result.error("获取订单详情失败: " + e.getMessage());
        }
    }

    // 管理员获取所有订单（带筛选和分页）
    @GetMapping("/admin/list")
    public Result getAdminOrderList(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestHeader("Authorization") String token) {

        try {
            token = token.replace("Bearer ", "");
            Claims claims = JwtUtils.parseJWT(token);
            boolean isAdmin = (boolean) claims.get("isAdmin");

            if (!isAdmin) {
                return Result.error("无权限操作");
            }

            log.info("管理员获取订单列表: status={}, search={}, startTime={}, endTime={}, sortField={}, sortOrder={}, page={}, pageSize={}",
                    status, search, startTime, endTime, sortField, sortOrder, page, pageSize);

            Map<String, Object> result = orderService.getAdminOrderList(
                    status,
                    search,
                    startTime,
                    endTime,
                    sortField,
                    sortOrder,
                    page,
                    pageSize
            );

            return Result.success(result);
        } catch (Exception e) {
            log.error("获取订单列表失败", e);
            return Result.error("获取订单列表失败: " + e.getMessage());
        }
    }
}