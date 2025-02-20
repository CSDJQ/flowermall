package com.backend.mapper;

import com.backend.pojo.Category;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CategoryMapper {
    @Insert("INSERT INTO category (flower_id, main_flower, purpose, color_scheme, stem_count, created_at, updated_at) VALUES (#{flowerId}, #{mainFlower}, #{purpose}, #{colorScheme}, #{stemCount}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "categoryId")
    void insertCategory(Category category);

    @Delete("DELETE FROM category WHERE category_id = #{categoryId}")
    void deleteCategoryById(Integer category_id);

    @Update("UPDATE category SET flower_id = #{flowerId}, main_flower = #{mainFlower}, purpose = #{purpose}, color_scheme = #{colorScheme}, stem_count = #{stemCount}, updated_at = NOW() WHERE category_id = #{categoryId}")
    void updateCategory(Category category);

    @Select("SELECT * FROM category WHERE category_id = #{categoryId}")
    Category getCategoryById(Integer category_id);

    @Select("SELECT * FROM category")
    List<Category> getAllCategories();

    @Select("SELECT * FROM category WHERE flower_id = #{flowerId}")
    Category getCategoryByFlowerId(Integer flower_id);
}
