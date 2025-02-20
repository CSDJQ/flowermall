package com.backend.service.impl;

import com.backend.mapper.CategoryMapper;
import com.backend.mapper.FlowerMapper;
import com.backend.pojo.Category;
import com.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private FlowerMapper flowerMapper;

//    public boolean addCategory(Category category){
//        if(categoryMapper.getCategoryByFlowerId(category.getFlowerId()) == null
//        && flowerMapper.getFlowerById(category.getFlowerId()) != null) {
//            categoryMapper.insertCategory(category);
//            return true;
//        }
//        return false;
//    }

    public boolean deleteCategory(Integer id) {
        if(categoryMapper.getCategoryById(id) == null) {
            return false;
        }
        categoryMapper.deleteCategoryById(id);
        return true;
    }

    public boolean updateCategory(Category category) {
        if(categoryMapper.getCategoryById(category.getId()) == null) {
            return false;
        }
        categoryMapper.updateCategory(category);
        return true;
    }

    public Category getCategoryById(Integer id) {
        return categoryMapper.getCategoryById(id);
    }

    public List<Category> getAllCategories() {
        return categoryMapper.getAllCategories();
    }

    public Category getCategoryByFlowerId(Integer id) {
        return categoryMapper.getCategoryByFlowerId(id);
    }
}