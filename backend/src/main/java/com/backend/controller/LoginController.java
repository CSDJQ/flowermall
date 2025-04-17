package com.backend.controller;

import com.backend.pojo.Cus;
import com.backend.service.CusService;
import com.backend.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.backend.pojo.Result;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
public class LoginController {

    String ADMINPHONE = "12345678910";

    @Autowired
    private CusService cusService;

    @PostMapping("/login")
    public Result login(@RequestBody Cus cus) {
        log.info("登录请求，request:{}", cus);

        Cus c = cusService.login(cus);

        if (c != null) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("id", c.getCusId());

            boolean isAdmin = ADMINPHONE.equals(c.getPhone());
            claims.put("isAdmin", isAdmin);

            String jwt = JwtUtils.generateJwt(claims);
            log.info("response: {}", jwt);

            return Result.success(jwt);
        }
        return Result.error("手机号或密码错误");
    }

    @PostMapping("/signup")
    public Result signup(@RequestBody Cus cus) {
        log.info("注册请求，request:{}", cus);

        boolean ifSignup = cusService.signup(cus);

        if(ifSignup) {
            return Result.success("注册成功");
        }
        return Result.error("注册失败，手机号已被注册");
    }
}