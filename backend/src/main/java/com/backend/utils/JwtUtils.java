package com.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.Map;

public class JwtUtils {

    private static String signKey = "example";
    private static Long expire = 43200000L; // 过期时间为12小时
//    private static Long expire = 20000L; // 过期时间为 20 秒

    /**
     * 生成JWT令牌
     * @param claims JWT第二部分负载 payload 中存储的内容
     * @return
     */
    public static String generateJwt(Map<String, Object> claims) {
        return Jwts.builder()
                .addClaims(claims)
                .signWith(SignatureAlgorithm.HS256, signKey)
                .setExpiration(new Date(System.currentTimeMillis() + expire))
                .compact();
    }

    /**
     * 解析JWT令牌
     * @param jwt JWT令牌
     * @return JWT第二部分负载 payload 中存储的内容
     */
    public static Claims parseJWT(String jwt) {
        return Jwts.parser()
                .setSigningKey(signKey)
                .parseClaimsJws(jwt)
                .getBody();
    }

    /**
     * 验证JWT令牌是否有效
     * @param jwt JWT令牌
     * @return 是否有效
     */
    public static boolean validateToken(String jwt) {
        try {
            Claims claims = parseJWT(jwt);
            return !claims.getExpiration().before(new Date()); // 检查是否过期
        } catch (Exception e) {
            return false; // 如果解析失败，说明 Token 无效
        }
    }
}