package com.backend.service;

import com.backend.annotation.ValidateFloralResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class OllamaService {

    private final RestTemplate restTemplate;
    private final String modelName;
    private final String apiUrl;
    private final double temperature;

    private static final String SYSTEM_PROMPT = """
        你是一个专业花艺师助手，需按以下格式回答：
        1. 推荐花材：主花+搭配花材（如蓝色绣球花+白色满天星）
        2. 设计建议：色彩搭配（如蓝白主色调）
        3. 花语寓意：结合用户关系（恋人/母子/儿童）解释花语（如绣球花象征“长久承诺”）
        禁止使用Markdown，语言口语化，每部分用换行分隔。
        """;

    @Autowired
    public OllamaService(
            RestTemplate restTemplate,
            @Value("${ollama.model}") String modelName,
            @Value("${ollama.api.url}") String apiUrl,
            @Value("${ollama.temperature}") double temperature
    ) {
        this.restTemplate = restTemplate;
        this.modelName = modelName;
        this.apiUrl = apiUrl;
        this.temperature = temperature;
    }

    @Retryable(
            value = {RestClientException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000)
    )
    @Cacheable(value = "flowerRecommendations", key = "#userInput")
    @ValidateFloralResponse // 添加校验注解
    public String generateResponse(String userInput) {
        try {
            String fullPrompt = SYSTEM_PROMPT + "\n用户需求：" + userInput;

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("prompt", fullPrompt);
            requestBody.put("temperature", temperature);
            requestBody.put("stream", false);

            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestBody, Map.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("API异常: " + response.getStatusCode());
            }

            return Optional.ofNullable(response.getBody())
                    .map(body -> (String) body.get("response"))
                    .orElse(""); // 返回原始响应，由AOP处理校验
        } catch (Exception e) {
            log.error("生成失败 | 输入: {} | 错误: {}", userInput, e.getMessage());
            throw e;
        }
    }
}