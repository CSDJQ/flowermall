package com.backend.controller;

import com.backend.pojo.Cus;
import com.backend.pojo.FlowerWithCategory;
import com.backend.pojo.Result;
import com.backend.service.CusService;
import com.backend.service.FlowerService;
import com.backend.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private FlowerService flowerService;

    @Autowired
    private CusService cusService;

    // 获取分类值列表
    @GetMapping("/categories/{type}")
    public Result getCategoryValues(@PathVariable String type) {
        log.info("获取分类值列表: type={}", type);
        List<String> values = flowerService.getCategoryValues(type);
        return Result.success(values);
    }

    // 根据分类类型和值查询商品
    @GetMapping("/flowers/byCategory")
    public Result getFlowersByCategory(
            @RequestParam String type,  // 分类类型（如 purpose）
            @RequestParam String value) { // 分类值（如 玫瑰）
        log.info("用户按分类查询商品: type={}, value={}", type, value);
        List<FlowerWithCategory> flowers = flowerService.getFlowersByCategory(type, value);
        return Result.success(flowers);
    }

    // 获取用户信息
    @GetMapping("/info")
    public Result getUserInfo(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "");
        Claims claims = JwtUtils.parseJWT(token);
        Integer userId = (Integer) claims.get("id");
        log.info("用户获取信息: userId={}", userId);
        Cus customer = cusService.getById(userId);
        return Result.success(customer);
    }

    // 修改个人信息
    @PutMapping("/updateInfo")
    public Result updateInfo(@RequestBody Map<String, String> params,
                                 @RequestHeader("Authorization") String token) {
        try {
            token = token.replace("Bearer ", "");
            Claims claims = JwtUtils.parseJWT(token);
            Integer userId = (Integer) claims.get("id");
            log.info("用户修改个人信息: userId={}", userId);

            String newUsername = params.get("username");
            String newPhone = params.get("phone");

            // 若手机号不同，验证手机号是否已被使用
            if (cusService.isNewPhoneExist(newPhone,userId)) {
                return Result.error("该手机号已被使用");
            }

            // 更新用户信息
            cusService.updateInfo(userId, newUsername, newPhone);

            return Result.success("个人信息修改成功");
        } catch (Exception e) {
            log.error("修改失败", e);
            return Result.error("修改失败: " + e.getMessage());
        }
    }

    // 修改密码
    @PostMapping("/updatePwd")
    public Result updatePassword(@RequestBody Map<String, String> params,
                                 @RequestHeader("Authorization") String token) {
        try {
            token = token.replace("Bearer ", "");
            Claims claims = JwtUtils.parseJWT(token);
            Integer userId = (Integer) claims.get("id");
            log.info("用户修改密码: userId={}", userId);

            String oldPassword = params.get("oldPassword");
            String newPassword = params.get("newPassword");

            // 验证旧密码是否正确
            if (!cusService.verifyPassword(userId, oldPassword)) {
                return Result.error("旧密码不正确");
            }

            // 更新密码
            cusService.updatePassword(userId, newPassword);

            return Result.success("密码修改成功");
        } catch (Exception e) {
            log.error("密码修改失败", e);
            return Result.error("密码修改失败: " + e.getMessage());
        }
    }
}