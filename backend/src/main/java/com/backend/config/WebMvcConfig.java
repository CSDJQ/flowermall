package com.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000") // 允许的前端地址
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 显式允许 OPTIONS 方法
//                .allowedHeaders("Authorization", "Content-Type")// 显式允许的请求头
//                .allowCredentials(true); // 允许携带凭据

        registry.addMapping("/**") // 允许所有路径
                .allowedOrigins("http://localhost:3000") // 允许的前端地址
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 允许的 HTTP 方法
                .allowedHeaders("*") // 允许的请求头
                .allowCredentials(true) // 允许携带凭证（如 Cookie）
                .maxAge(3600); // 预检请求的缓存时间
    }
}
