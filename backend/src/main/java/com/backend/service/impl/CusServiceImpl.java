package com.backend.service.impl;


import com.backend.mapper.CusMapper;
import com.backend.pojo.Cus;
import com.backend.service.CusService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CusServiceImpl implements CusService {
    @Autowired
    private CusMapper cusMapper;

    @Override
    public Cus login(Cus cus) {
        return cusMapper.getCusByPhoneAndPWD(cus);
    }

    @Override
    public boolean signup(Cus cus) {
        // 手机号是否已注册
        if(cusMapper.getUserByPhone(cus.getPhone())==null){
            // 未注册
            cusMapper.addCus(cus);
            return true;
        }
        // 手机号冲突
        return false;
    }
}
