package com.backend.service.impl;

import com.backend.mapper.ShippingAddressMapper;
import com.backend.pojo.ShippingAddress;
import com.backend.service.ShippingAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShippingAddressServiceImpl implements ShippingAddressService {
    @Autowired
    private ShippingAddressMapper addressMapper;

    @Override
    @Transactional
    public int addAddress(ShippingAddress address) {
        if (address.getIsDefault() != null && address.getIsDefault()) {
            addressMapper.clearDefaultStatus(address.getCusId());
        }
        return addressMapper.insert(address);
    }

    @Override
    public boolean deleteAddress(Integer addressId, Integer cusId) {
        return addressMapper.delete(addressId, cusId) > 0;
    }

    @Override
    @Transactional
    public boolean updateAddress(ShippingAddress address) {
        if (address.getIsDefault() != null && address.getIsDefault()) {
            // 如果要设置默认地址，先清除
            addressMapper.clearDefaultStatus(address.getCusId());
        }
        return addressMapper.update(address) > 0;
    }

    @Override
    public ShippingAddress getDefaultAddress(Integer cusId) {
        return addressMapper.selectDefaultByCustomer(cusId);
    }

    @Override
    public List<ShippingAddress> getAddressesByCustomer(Integer cusId) {
        return addressMapper.selectByCustomer(cusId);
    }

    @Override
    public ShippingAddress getAddressById(Integer addressId, Integer cusId) {
        return addressMapper.selectById(addressId, cusId);
    }
}