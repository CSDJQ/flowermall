package com.backend.controller;

import com.backend.service.DeepSeekService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/ai")
public class AIController {
    @Autowired
    private DeepSeekService deepSeekService; // 修改服务引用

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody Map<String, String> request) {
        try {
            log.info("AI请求：{}", request);
            String answer = deepSeekService.generateResponse(request.get("input")); // 修改方法调用
            log.info("AI响应：{}", answer);
            return ResponseEntity.ok(answer);
        } catch (Exception e) {
            log.error("请求处理失败：", e);
            return ResponseEntity.internalServerError().body("服务繁忙，请稍后重试");
        }
    }
}