package com.backend.service;

import com.backend.pojo.Category;
import org.springframework.dao.DuplicateKeyException;

import java.util.List;

public interface CategoryService {
//    public boolean addCategory(Category category);

    public boolean deleteCategory(Integer id);

    public boolean updateCategory(Category category);

    public Category getCategoryById(Integer id);

    public List<Category> getAllCategories();
}
