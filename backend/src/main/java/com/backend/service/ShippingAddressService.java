package com.backend.service;

import com.backend.pojo.ShippingAddress;

import java.util.List;

public interface ShippingAddressService {
    int addAddress(ShippingAddress address);
    boolean deleteAddress(Integer addressId, Integer cusId);
    boolean updateAddress(ShippingAddress address);
    ShippingAddress getDefaultAddress(Integer cusId);
    List<ShippingAddress> getAddressesByCustomer(Integer cusId);
    ShippingAddress getAddressById(Integer addressId, Integer cusId);
}