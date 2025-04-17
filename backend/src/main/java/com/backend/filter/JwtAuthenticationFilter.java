package com.backend.filter;

import com.backend.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 放行OPTIONS请求和允许的路径
        if (isPermittedRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = extractJwt(request);
        if (!StringUtils.hasLength(jwt)) {
            sendError(response, "NOT_LOGIN");
            return;
        }

        try {
            Claims claims = JwtUtils.parseJWT(jwt);
            Authentication authentication = createAuthentication(claims);
            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            sendError(response, "INVALID_TOKEN");
        }
    }

    private boolean isPermittedRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
        return "OPTIONS".equalsIgnoreCase(request.getMethod()) ||
                path.startsWith("/login") ||
                path.startsWith("/signup");
    }

    private String extractJwt(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        return (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7)
                : null;
    }

    private Authentication createAuthentication(Claims claims) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (Boolean.TRUE.equals(claims.get("isAdmin", Boolean.class))) {
            authorities.add(new SimpleGrantedAuthority("ADMIN"));
        }
        return new UsernamePasswordAuthenticationToken(
                claims.get("id"),
                null,
                authorities
        );
    }

    private void sendError(HttpServletResponse response, String errorCode) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"code\":\"" + errorCode + "\"}");
    }
}