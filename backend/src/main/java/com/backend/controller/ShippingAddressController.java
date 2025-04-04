package com.backend.controller;

import com.backend.pojo.Result;
import com.backend.pojo.ShippingAddress;
import com.backend.service.ShippingAddressService;
import com.backend.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/addresses")
@Slf4j
public class ShippingAddressController {

    @Autowired
    private ShippingAddressService addressService;

    // 从 JWT Token 中解析出客户 ID
    private Integer getCustomerIdFromToken(String token) throws Exception {
        token = token.replace("Bearer ", "");
        Claims claims = JwtUtils.parseJWT(token);
        return (Integer) claims.get("id");
    }

    @PostMapping
    public Result addAddress(@RequestHeader("Authorization") String token, @RequestBody ShippingAddress address) {
        log.info("新增收货地址: {}", address);
        try {
            Integer cusId = getCustomerIdFromToken(token);
            address.setCusId(cusId);
            int addressId = addressService.addAddress(address);
            return Result.success(addressId);
        } catch (Exception e) {
            log.error("新增收货地址失败: {}", e.getMessage(), e);
            return Result.error("新增收货地址失败: " + e.getMessage());
        }
    }

    @GetMapping
    public Result getCustomerAddresses(@RequestHeader("Authorization") String token) {
        log.info("获取收货地址列表");
        try {
            Integer cusId = getCustomerIdFromToken(token);
            return Result.success(addressService.getAddressesByCustomer(cusId));
        } catch (Exception e) {
            log.error("获取收货地址列表失败: {}", e.getMessage(), e);
            return Result.error("获取收货地址列表失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{addressId}")
    public Result deleteAddress(@PathVariable Integer addressId, @RequestHeader("Authorization") String token) {
        log.info("删除收货地址: addressId={}", addressId);
        try {
            Integer cusId = getCustomerIdFromToken(token);
            log.info("删除收货地址: addressId={}, cusId={}", addressId, cusId);
            boolean success = addressService.deleteAddress(addressId, cusId);
            return success ? Result.success() : Result.error("地址不存在");
        } catch (Exception e) {
            log.error("删除收货地址失败: {}", e.getMessage(), e);
            return Result.error("删除收货地址失败: " + e.getMessage());
        }
    }

    @PutMapping
    public Result updateAddress(@RequestBody ShippingAddress address, @RequestHeader("Authorization") String token) {
        log.info("更新收货地址: {}", address);
        try {
            Integer cusId = getCustomerIdFromToken(token);
            address.setCusId(cusId);
            boolean success = addressService.updateAddress(address);
            return success ? Result.success() : Result.error("地址记录不存在");
        } catch (Exception e) {
            log.error("更新收货地址失败: {}", e.getMessage(), e);
            return Result.error("更新收货地址失败: " + e.getMessage());
        }
    }


    @GetMapping("/default")
    public Result getDefaultAddress(@RequestHeader("Authorization") String token) {
        try {
            Integer cusId = getCustomerIdFromToken(token);
            ShippingAddress address = addressService.getDefaultAddress(cusId);
            return address != null ? Result.success(address) : Result.error("未设置默认地址");
        } catch (Exception e) {
            log.error("获取默认地址失败", e);
            return Result.error("获取默认地址失败: " + e.getMessage());
        }
    }

//    @GetMapping("/{addressId}")
//    public Result getAddressDetail(@PathVariable Integer addressId, @RequestParam Integer cusId) {
//        try {
//            ShippingAddress address = addressService.getAddressById(addressId, cusId);
//            return address != null ? Result.success(address) : Result.error("地址不存在");
//        } catch (Exception e) {
//            log.error("获取地址详情失败", e);
//            return Result.error("获取地址详情失败: " + e.getMessage());
//        }
//    }
}