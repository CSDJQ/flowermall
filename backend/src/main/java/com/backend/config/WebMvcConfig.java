package com.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000") // 允许的前端地址
                .allowedOrigins("*") // 允许的前端地址
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 显式允许 OPTIONS 方法
                .allowedHeaders("Authorization", "Content-Type");// 显式允许的请求头
//                .allowCredentials(true); // 允许携带凭据
    }
}
