package com.backend.mapper;

import com.backend.pojo.Cus;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface CusMapper {
    @Select("select * from customers where phone = #{phone} and password = #{password}")
    Cus getCusByPhoneAndPWD(Cus cus);

    @Insert("insert into customers (username,phone, password) " +
            "VALUES (#{username},#{phone},#{password})")
    void addCus(Cus cus);

    @Select("select * from customers where phone = #{phone}")
    Cus getUserByPhone(String phone);

    @Select("select * from customers where cus_id = #{cusId}")
    Cus getCusById(Integer cusId);

    @Update("update customers SET username=#{newUsername},phone=#{phone} where cus_id=#{userId}")
    void updateUsername(Integer userId,String newUsername,String phone);

    @Select("SELECT * FROM customers WHERE phone = #{newPhone} AND cus_id != #{cusId}")
    Cus isNewPhoneExist(String newPhone,Integer cusId);

    @Update("update customers SET username=#{newUsername}, phone=#{newPhone} where cus_id=#{cusId}")
    void updateInfo(Integer cusId, String newUsername, String newPhone);

    @Select("select password from customers where cus_id=#{userId}")
    String getPasswordById(Integer userId);

    @Update("update customers set password = #{newPassword} where cus_id = #{userId}")
    void updatePassword(Integer userId, String newPassword);
}
