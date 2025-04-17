package com.backend.service.impl;

import com.backend.mapper.CusMapper;
import com.backend.pojo.Cus;
import com.backend.service.CusService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CusServiceImpl implements CusService {
    @Autowired
    private CusMapper cusMapper;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Cus login(Cus cus) {
        Cus dbCus = cusMapper.getCusByPhone(cus.getPhone());
        // 前端传的是 SHA256，需用 BCrypt 验证数据库中的哈希
        if (dbCus != null && passwordEncoder.matches(cus.getPassword(), dbCus.getPassword())) {
            return dbCus;
        }
        return null;
    }

    @Override
    public boolean signup(Cus cus) {
        if (cusMapper.getUserByPhone(cus.getPhone()) == null) {
            // 对前端传来的 SHA256 值再做 BCrypt 哈希
            String bcryptHash = passwordEncoder.encode(cus.getPassword());
            cus.setPassword(bcryptHash);
            cusMapper.addCus(cus);
            return true;
        }
        return false;
    }

    @Override
    public Cus getById(Integer cusId){
        Cus cus = cusMapper.getCusById(cusId);
        cus.setPassword(null);// 避免密码泄露
        return cus;
    }

    @Override
    public boolean isNewPhoneExist(String newPhone,Integer cusId) {
        return cusMapper.isNewPhoneExist(newPhone,cusId)!=null;
    }

    @Override
    public void updateInfo(Integer cusId, String newUsername, String newPhone){
        cusMapper.updateInfo(cusId,newUsername,newPhone);
    }

    @Override
    public boolean verifyPassword(Integer userId, String password) {
        // 前端传的是 SHA256
        String currentPassword = cusMapper.getPasswordById(userId);
        return passwordEncoder.matches(password, currentPassword);
    }

    @Override
    public void updatePassword(Integer userId, String newPassword) {
        // 前端传的是 SHA256，需要再次BCrypt加密
        String encodedPassword = passwordEncoder.encode(newPassword);
        cusMapper.updatePassword(userId, encodedPassword);
        log.info("用户ID {} 修改了密码", userId);
    }
}