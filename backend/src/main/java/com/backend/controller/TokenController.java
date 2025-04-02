package com.backend.controller;

import com.backend.pojo.Result;
import com.backend.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/token")
public class TokenController {

    @GetMapping("/validate")
    public Result validateToken() {
        // 能执行到这里说明LoginFilter已通过验证
        return Result.success("Token有效");
    }

    @GetMapping("/refresh")
    public Result refreshToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Claims claims = JwtUtils.parseJWT(token);
        String newToken = JwtUtils.generateJwt(claims);
        return Result.success(newToken);
    }
}