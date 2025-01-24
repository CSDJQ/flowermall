package com.backend.mapper;

import com.backend.pojo.Cus;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CusMapper {
    @Select("select * from customers where phone = #{phone} and password = #{password}")
    Cus getCusByPhoneAndPWD(Cus cus);

    @Insert("insert into customers (username,phone, password) " +
            "VALUES (#{username},#{phone},#{password})")
    void addCus(Cus cus);

    @Select("select * from customers where phone = #{phone}")
    Cus getUserByPhone(String phone);
}
