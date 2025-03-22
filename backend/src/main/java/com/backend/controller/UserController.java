package com.backend.controller;

import com.backend.pojo.Flower;
import com.backend.pojo.FlowerWithCategory;
import com.backend.pojo.Result;
import com.backend.service.FlowerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {

    @Autowired
    private FlowerService flowerService;

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
}