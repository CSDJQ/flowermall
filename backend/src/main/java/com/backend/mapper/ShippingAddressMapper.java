package com.backend.mapper;

import com.backend.pojo.ShippingAddress;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ShippingAddressMapper {
    @Insert("INSERT INTO shipping_address (cus_id, receiver_name, receiver_phone, district, detailed_address, is_default) " +
            "VALUES (#{cusId}, #{receiverName}, #{receiverPhone}, #{district}, #{detailedAddress}, #{isDefault})")
    @Options(useGeneratedKeys = true, keyProperty = "addressId")
    int insert(ShippingAddress address);

    @Update("UPDATE shipping_address SET is_default = 0 WHERE cus_id = #{cusId}")
    int clearDefaultStatus(Integer cusId);

    @Delete("DELETE FROM shipping_address WHERE address_id = #{addressId} AND cus_id = #{cusId}")
    int delete(@Param("addressId") Integer addressId, @Param("cusId") Integer cusId);

    @Update("<script>" +
            "UPDATE shipping_address " +
            "<set>" +
            "  <if test='receiverName != null'>receiver_name = #{receiverName},</if>" +
            "  <if test='receiverPhone != null'>receiver_phone = #{receiverPhone},</if>" +
            "  <if test='district != null'>district = #{district},</if>" +
            "  <if test='detailedAddress != null'>detailed_address = #{detailedAddress},</if>" +
            "  <if test='isDefault != null'>is_default = #{isDefault},</if>" +
            "</set>" +
            "WHERE address_id = #{addressId} AND cus_id = #{cusId}" +
            "</script>")
    int update(ShippingAddress address);

    @Select("SELECT * FROM shipping_address WHERE cus_id = #{cusId} AND is_default = 1 LIMIT 1")
    ShippingAddress selectDefaultByCustomer(Integer cusId);

    @Select("SELECT * FROM shipping_address WHERE cus_id = #{cusId} ORDER BY is_default DESC, updated_at DESC")
    List<ShippingAddress> selectByCustomer(Integer cusId);

    @Select("SELECT * FROM shipping_address WHERE address_id = #{addressId} AND cus_id = #{cusId}")
    ShippingAddress selectById(@Param("addressId") Integer addressId, @Param("cusId") Integer cusId);
}