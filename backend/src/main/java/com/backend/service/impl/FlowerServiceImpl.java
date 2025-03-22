package com.backend.service.impl;

import com.backend.mapper.CategoryMapper;
import com.backend.mapper.FlowerMapper;
import com.backend.pojo.Category;
import com.backend.pojo.Flower;
import com.backend.pojo.FlowerWithCategory;
import com.backend.service.FlowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FlowerServiceImpl implements FlowerService {
    @Autowired
    private FlowerMapper flowerMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Transactional // 确保事务一致性
    @Override
    // 添加商品
    public int addFlower(FlowerWithCategory request) {
        // 插入 flower 表
        Flower flower = new Flower(0,request.getName(),request.getDescription(),request.getOriginalPrice(),request.getDiscountPrice(),request.getIsOnSale(),request.getImageUrl(),null,null);
        flowerMapper.insertFlower(flower);

        // 获取生成的 flower_id
        Integer flowerId = flower.getFlowerId();

        // 插入 category 表
        Category category = new Category(0,flowerId,request.getMainFlower(),request.getPurpose(),request.getColorScheme(),request.getStemCount(),null,null);
        categoryMapper.insertCategory(category);
        return flowerId;
    }

    // 删除商品
    public boolean deleteFlower(Integer flowerId) {
        if(flowerMapper.getFlowerById(flowerId) == null) {
            return false;
        }
        flowerMapper.deleteFlowerById(flowerId);
        return true;
    }

    // 修改基本信息
    public boolean updateFlower(Flower flower) {
        if(flowerMapper.getFlowerById(flower.getFlowerId()) == null) {
            return false;
        }
        flowerMapper.updateFlower(flower);
        return true;
    }

    // 修改分类信息
    public boolean updateCategory(Category category) {
        if(categoryMapper.getCategoryByCategoryId(category.getCategoryId()) == null) {
            return false;
        }
        categoryMapper.updateCategory(category);
        return true;
    }

    // 以种类ID查询分类
    public Category getCategoryByCategoryId(Integer categoryId) {
        return categoryMapper.getCategoryByCategoryId(categoryId);
    }

    public List<Flower> getAllFlowers() {
        return flowerMapper.getAllFlowers();
    }

    // 获取分类值列表
    public List<String> getCategoryValues(String type) {
        return flowerMapper.selectCategoryValues(type);
    }

    // 根据分类类型和值查询商品
    public List<FlowerWithCategory> getFlowersByCategory(String type, String value) {
        return flowerMapper.selectFlowersByCategory(type, value);
    }
}