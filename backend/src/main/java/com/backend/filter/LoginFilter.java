package com.backend.filter;

import com.alibaba.fastjson.JSONObject;
import com.backend.pojo.Result;
import com.backend.utils.JwtUtils;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.Set;

@Component
@Slf4j
@WebFilter(urlPatterns = "/*")
public class LoginFilter implements Filter {

    private static final Set<String> ALLOWED_PATHS = Set.of("/login", "/signup");

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String url = req.getRequestURI().toString();
        log.info("Request URL: {}, Method: {}", url, req.getMethod());

        // 设置 CORS 头
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // 允许 OPTIONS 请求通过
        if (req.getMethod().equals("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }

        // 如果请求路径在允许列表中，直接放行
        if (ALLOWED_PATHS.contains(url)) {
            log.info("允许的路径: {}", url);
            chain.doFilter(request, response);
            return;
        }

        // 其他逻辑保持不变
        String jwt = null; // 初始化jwt变量为null
        String authHeader = req.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 移除"Bearer "前缀并获取JWT
            jwt = authHeader.substring(7);
        }

        if (!StringUtils.hasLength(jwt)) {
            log.info("JWT: {}", jwt);
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 返回 401 状态码
            res.setContentType("application/json;charset=UTF-8");
            res.getWriter().write(notLogin);
            return;
        }
        try {
            JwtUtils.parseJWT(jwt);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("解析令牌失败");
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 返回 401 状态码
            res.setContentType("application/json;charset=UTF-8");
            res.getWriter().write(notLogin);
            return;
        }

        log.info("令牌合法放行");
        chain.doFilter(request, response);
    }
}