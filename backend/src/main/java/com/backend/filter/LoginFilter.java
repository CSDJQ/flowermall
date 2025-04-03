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
    private static final Set<String> ALLOWED_PATHS = Set.of(
            "/login",
            "/signup"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // 放行OPTIONS预检请求
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        // 放行白名单路径
        String path = req.getRequestURI();
        if (ALLOWED_PATHS.stream().anyMatch(path::startsWith)) {
            chain.doFilter(request, response);
            return;
        }

        // JWT验证
        String jwt = extractJwt(req);
        if (!validateJwt(jwt, res)) {
            return;
        }

        chain.doFilter(request, response);
    }

    private String extractJwt(HttpServletRequest req) {
        String authHeader = req.getHeader("Authorization");
        return (authHeader != null && authHeader.startsWith("Bearer ")) ?
                authHeader.substring(7) : null;
    }

    private boolean validateJwt(String jwt, HttpServletResponse res) throws IOException {
        if (!StringUtils.hasLength(jwt)) {
            sendError(res, "NOT_LOGIN");
            return false;
        }

        try {
            JwtUtils.parseJWT(jwt);
            return true;
        } catch (Exception e) {
            log.error("JWT验证失败", e);
            sendError(res, "INVALID_TOKEN");
            return false;
        }
    }

    private void sendError(HttpServletResponse res, String errorCode) throws IOException {
        // 保留CORS头
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // 设置错误响应
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        res.setContentType("application/json;charset=UTF-8");
        res.getWriter().write(JSONObject.toJSONString(Result.error(errorCode)));
    }
}