package com.backend.service.impl;


import com.backend.mapper.CusMapper;
import com.backend.pojo.Cus;
import com.backend.service.CusService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
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
        // 获取用户当前密码(加密后的)
        String currentPassword = cusMapper.getPasswordById(userId);
        // 验证密码是否匹配
        return password.equals(currentPassword);
    }

    @Override
    public void updatePassword(Integer userId, String newPassword) {
        // 对新密码进行加密
        cusMapper.updatePassword(userId, newPassword);

        // 记录密码修改日志
        log.info("用户ID {} 修改了密码", userId);
    }
}
