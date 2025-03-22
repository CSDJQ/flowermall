package com.backend.aspect;

import com.backend.annotation.ValidateFloralResponse;
import com.backend.utils.ResponseValidator;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class ResponseValidationAspect {

    @Around("@annotation(ValidateFloralResponse)")
    public Object validateResponse(ProceedingJoinPoint joinPoint) throws Throwable {
        Object result = joinPoint.proceed();

        if (result instanceof String response) {
            if (!ResponseValidator.isValidFormat(response)) {
                log.warn("格式校验失败 | 原始响应: {}", response);
                return ResponseValidator.getFallbackResponse();
            }
        }
        return result;
    }
}