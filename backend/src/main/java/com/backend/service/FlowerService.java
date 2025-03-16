package com.backend.service;

import com.backend.pojo.Category;
import com.backend.pojo.Flower;
import com.backend.pojo.FlowerWithCategoryRequest;

import java.util.List;

public interface FlowerService {
    public int addFlower(FlowerWithCategoryRequest flower);
    public boolean deleteFlower(Integer flowerId);
    public boolean updateFlower(Flower flower);
    public boolean updateFlower(Category category);
    public Category getCategoryByFlowerId(Integer flowerId);
//    public FlowerWithCategoryRequest getFlowerById(Integer id);
    public List<Flower> getAllFlowers();
}
