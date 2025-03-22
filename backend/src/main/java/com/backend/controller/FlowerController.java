package com.backend.controller;

import com.backend.pojo.Category;
import com.backend.pojo.Flower;
import com.backend.pojo.FlowerWithCategory;
import com.backend.pojo.Result;
import com.backend.service.FlowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/flowers")
public class FlowerController {
    @Autowired
    private FlowerService flowerService;

    @PostMapping
    public Result addFlower(@RequestBody FlowerWithCategory flower) {
        log.info(flower.toString());
        int flowerId = flowerService.addFlower(flower);
        return Result.success(flowerId);
    }

    @DeleteMapping("/{flowerId}")
    public Result deleteFlower(@PathVariable Integer flowerId) {
        boolean ifdelete = flowerService.deleteFlower(flowerId);
        if (ifdelete) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败，对象不存在");
    }

    @PutMapping()
    public Result updateFlower(@RequestBody Flower flower) {
        boolean ifupdate = flowerService.updateFlower(flower);
        if (ifupdate) {
            return Result.success("修改成功");
        }
        return Result.error("修改失败，对象不存在");
    }

    @GetMapping
    public List<Flower> getAllFlowers() {
        return flowerService.getAllFlowers();
    }

    @PutMapping("/category")
    public Result updateCategory(@RequestBody Category category) {
        log.info(category.toString());
        boolean ifupdate = flowerService.updateCategory(category);
        if (ifupdate) {
            return Result.success("修改成功");
        }
        return Result.error("修改失败，对象不存在");
    }

    @GetMapping("/category/{id}")
    public Category getCategoryByCategoryId(@PathVariable Integer id) {
        return flowerService.getCategoryByCategoryId(id);
    }
}