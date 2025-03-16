package com.backend.mapper;

import com.backend.pojo.Flower;
//import org.apache.ibatis.annotations.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FlowerMapper {

    void insertFlower(Flower flower);

    @Delete("DELETE FROM flower WHERE flower_id = #{flowerId}")
    void deleteFlowerById(Integer flower_id);

    @Update("UPDATE flower SET name = #{name}, description = #{description}, original_price = #{originalPrice}, discount_price = #{discountPrice}, is_on_sale = #{isOnSale},image_url = #{imageUrl}, updated_at = NOW() WHERE flower_id = #{flowerId}")
    void updateFlower(Flower flower);

    @Select("SELECT * FROM flower WHERE flower_id = #{flowerId}")
    Flower getFlowerById(Integer flower_id);

    @Select("SELECT * FROM flower")
    List<Flower> getAllFlowers();
}