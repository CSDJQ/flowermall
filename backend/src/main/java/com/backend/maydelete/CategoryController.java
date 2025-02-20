package com.backend.controller;

import com.backend.pojo.Category;
import com.backend.pojo.Result;
import com.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public Result addCategory(@RequestBody Category category) {
        boolean ifadd = categoryService.addCategory(category);
        if (ifadd) {
            return Result.success(category.getId());
        }
        return Result.error("添加失败");
    }

    @DeleteMapping("/{id}")
    public Result deleteCategory(@PathVariable Integer id) {
        boolean ifdelete = categoryService.deleteCategory(id);
        if (ifdelete) {
            return Result.success("删除成功");
        }
        return Result.error("删除失败，对象不存在");
    }

    @PutMapping
    public Result updateCategory(@RequestBody Category category) {
        boolean ifupdate = categoryService.updateCategory(category);
        if (ifupdate) {
            return Result.success("修改成功");
        }
        return Result.error("修改失败，对象不存在");
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Integer id) {
        return categoryService.getCategoryById(id);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }
}