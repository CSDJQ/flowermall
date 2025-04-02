package com.backend.service;

import com.backend.pojo.Category;
import com.backend.pojo.Flower;
import com.backend.pojo.FlowerWithCategory;

import java.util.List;
import java.util.Map;

public interface FlowerService {
    public int addFlower(FlowerWithCategory flower);
    public boolean deleteFlower(Integer flowerId);
    public boolean updateFlower(Flower flower);
    public boolean updateCategory(Category category);
    public Category getCategoryByFlowerId(Integer flowerId);
    public List<Flower> getAllFlowers();

    public List<String> getCategoryValues(String type);

    public List<FlowerWithCategory> getFlowersByCategory(String type, String value);
}
