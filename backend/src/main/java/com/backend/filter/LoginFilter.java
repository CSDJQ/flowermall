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

@Component
@Slf4j
@WebFilter(urlPatterns = "/*")
public class LoginFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String url = req.getRequestURI().toString();
        log.info("URL: {}", url);

        if(url.equals("/login")||url.equals("/signup")) {
            log.info("Login or signup");
            chain.doFilter(request, response);
            return;
        }

        String jwt = null; // 初始化jwt变量为null
        String authHeader = req.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 移除"Bearer "前缀并获取JWT
            jwt = authHeader.substring(7);
        }

        if(!StringUtils.hasLength(jwt)) {
            log.info("JWT: {}", jwt);
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            res.getWriter().write(notLogin);
            return;
        }
        try{
            JwtUtils.parseJWT(jwt);
        }catch(Exception e) {
            e.printStackTrace();
            log.info("解析令牌失败");
            Result error = Result.error("NOT_LOGIN");
            String notLogin = JSONObject.toJSONString(error);
            res.getWriter().write(notLogin);
            return;
        }

        log.info("令牌合法放行");
        chain.doFilter(request, response);
    }
}
