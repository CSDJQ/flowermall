package com.backend.service;

import com.backend.pojo.Category;
import com.backend.pojo.Flower;
import com.backend.pojo.FlowerWithCategoryRequest;

import java.util.List;

public interface FlowerService {
    public int addFlower(FlowerWithCategoryRequest flower);
    public boolean deleteFlower(Integer flowerId);
    public boolean updateFlower(Flower flower);
    public boolean updateCategory(Category category);
    public Category getCategoryByCategoryId(Integer flowerId);
    public List<Flower> getAllFlowers();
}
