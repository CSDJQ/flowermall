package com.backend.service;

import com.backend.pojo.Cus;
import jakarta.servlet.http.HttpServletRequest;

public interface CusService {
    //   用户登录
    public Cus login(Cus cus);

    //  用户注册
    public boolean signup(Cus cus);

    // 用户查询
    public Cus getById(Integer cusId);

    public boolean isNewPhoneExist(String newPhone,Integer cusId);

    public void updateInfo(Integer cusId, String newUsername, String newPhone);

    public boolean verifyPassword(Integer userId, String oldPassword);

    public void updatePassword(Integer userId, String newPassword);
}
