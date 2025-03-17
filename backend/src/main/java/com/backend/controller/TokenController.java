package com.backend.controller;

import com.backend.pojo.Result;
import com.backend.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/token")
public class TokenController {

    /**
     * 验证 Token 是否有效
     *
     * @param authHeader 请求头中的 Authorization
     * @return 验证结果
     */
    @GetMapping("/validate")
    public Result validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "未授权"); // 返回 401
        }

        String token = authHeader.substring(7); // 去掉 "Bearer " 前缀
        boolean isValid = JwtUtils.validateToken(token); // 验证 Token 是否有效

        if (isValid) {
            return Result.success("Token 有效");
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token 无效或过期"); // 返回 401
        }
    }

    /**
     * 刷新 Token
     *
     * @param authHeader 请求头中的 Authorization
     * @return 新的 Token
     */
    @GetMapping("/refresh")
    public Result refreshToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "未授权"); // 返回 401
        }

        String token = authHeader.substring(7); // 去掉 "Bearer " 前缀
        boolean isValid = JwtUtils.validateToken(token); // 验证 Token 是否有效

        if (isValid) {
            // 如果 Token 有效，生成新的 Token
            Claims claims = JwtUtils.parseJWT(token);
            String newToken = JwtUtils.generateJwt(new HashMap<>(claims));
            return Result.success(newToken);
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token 无效或过期，无法刷新"); // 返回 401
        }
    }
}