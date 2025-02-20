package com.backend.controller;

import com.backend.pojo.Category;
import com.backend.pojo.Flower;
import com.backend.pojo.FlowerWithCategoryRequest;
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
    public Result addFlower(@RequestBody FlowerWithCategoryRequest flower) {
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

    @PutMapping("/category")
    public Result updateFlower(@RequestBody Category category) {
        Category oldCate = flowerService.getCategoryByFlowerId(category.getFlowerId());
        category.setCategoryId(oldCate.getCategoryId());
        boolean ifupdate = flowerService.updateFlower(category);
        if (ifupdate) {
            return Result.success("修改成功");
        }
        return Result.error("修改失败，对象不存在");
    }

//    @GetMapping("/{id}")
//    public FlowerWithCategoryRequest getFlowerById(@PathVariable Integer id) {
//        return flowerService.getFlowerById(id);
//    }
//
//    @GetMapping
//    public List<FlowerWithCategoryRequest> getAllFlowers() {
//        return flowerService.getAllFlowers();
//    }
}