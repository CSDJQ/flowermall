package com.backend.service;

import com.backend.pojo.Cus;
import jakarta.servlet.http.HttpServletRequest;

public interface CusService {
    //   用户登录
    public Cus login(Cus cus);

    //  用户注册
    public boolean signup(Cus cus);
}
