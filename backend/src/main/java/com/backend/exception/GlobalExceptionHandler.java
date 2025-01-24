package com.backend.exception;

import com.backend.pojo.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)//全局异常处理器
    public Result exception(Exception ex) {
        ex.printStackTrace();
        return Result.error("操作失败，请联系管理员");
    }
}
