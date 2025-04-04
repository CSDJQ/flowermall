package com.backend.filter;

import com.alibaba.fastjson.JSONObject;
import com.backend.pojo.Result;
import com.backend.utils.JwtUtils;
import io.jsonwebtoken.Claims;
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

    // 需要管理员权限的路径
    private static final Set<String> ADMIN_PATHS = Set.of(
            "/flowers"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String path = req.getRequestURI();

        // 放行OPTIONS预检请求
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        // 放行白名单路径
        if (ALLOWED_PATHS.stream().anyMatch(path::startsWith)) {
            chain.doFilter(request, response);
            return;
        }

        // JWT验证
        String jwt = extractJwt(req);
        if (!StringUtils.hasLength(jwt)) {
            sendError(res, "NOT_LOGIN");
            return;
        }

        try {
            Claims claims = JwtUtils.parseJWT(jwt);

            // 检查管理员权限路径
            if (ADMIN_PATHS.stream().anyMatch(path::startsWith)) {
                Boolean isAdmin = claims.get("isAdmin", Boolean.class);
                if (isAdmin == null || !isAdmin) {
                    sendError(res, "PERMISSION_DENIED");
                    return;
                }
                log.info("管理员访问权限验证通过: path={}", path);
            }

            chain.doFilter(request, response);
        } catch (Exception e) {
            log.error("JWT验证失败", e);
            sendError(res, "INVALID_TOKEN");
        }
    }

    private String extractJwt(HttpServletRequest req) {
        String authHeader = req.getHeader("Authorization");
        return (authHeader != null && authHeader.startsWith("Bearer ")) ?
                authHeader.substring(7) : null;
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