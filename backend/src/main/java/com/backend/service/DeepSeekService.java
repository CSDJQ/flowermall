package com.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class DeepSeekService {
    private final RestTemplate restTemplate;
    private final FloralKnowledgeBase knowledgeBase;
    private final String modelName;
    private final String apiUrl;
    private final String apiKey;
    private final double temperature;

    @Autowired
    public DeepSeekService(
            RestTemplate restTemplate,
            FloralKnowledgeBase knowledgeBase,
            @Value("${deepseek.model}") String modelName,
            @Value("${deepseek.api.url}") String apiUrl,
            @Value("${deepseek.api.key}") String apiKey,
            @Value("${deepseek.temperature}") double temperature) {
        this.restTemplate = restTemplate;
        this.knowledgeBase = knowledgeBase;
        this.modelName = modelName;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.temperature = temperature;
    }

    @Retryable(value = {RestClientException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    @Cacheable(value = "flowerRecommendations", key = "#userInput")
    public String generateResponse(String userInput) {
        try {
            String enhancedPrompt = buildEnhancedPrompt(userInput);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("messages", List.of(
                    Map.of("role", "user", "content", enhancedPrompt)
            ));
            requestBody.put("temperature", temperature);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            return Optional.ofNullable(restTemplate.postForEntity(apiUrl, requestEntity, Map.class).getBody())
                    .map(body -> {
                        List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
                        if (choices != null && !choices.isEmpty()) {
                            Map<String, Object> firstChoice = choices.get(0);
                            Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                            if (message != null) {
                                return (String) message.get("content");
                            }
                        }
                        return null;
                    })
                    .orElseThrow(() -> new RuntimeException("Empty response from DeepSeek API"));
        } catch (Exception e) {
            log.error("生成失败 | 输入: {} | 错误: {}", userInput, e.getMessage());
            throw e;
        }
    }

    private String buildEnhancedPrompt(String userInput) {
        if (userInput == null || userInput.trim().isEmpty()) {
            userInput = "请提供花束需求";
        }

        String occasion = extractOccasion(userInput);
        String recipient = extractRecipient(userInput);

        String reference = "";
        log.info("提取信息 - 场合: {}, 收花人: {}", occasion, recipient);
        if (!occasion.isEmpty()) {
            reference += knowledgeBase.getOccasionAdvice(occasion)+"；";
        }
        if (!recipient.isEmpty()) {
            reference += knowledgeBase.getRecipientAdvice(recipient);
        }
        if (reference.isEmpty()) {
            reference = knowledgeBase.getAllFlowerMeaning().toString();
        }
        log.info(reference);

        return String.format("""
        【指令】你是花艺师助手，使用纯简中、文本非MD回答。
        【用户需求】%s
        【专业参考建议】%s
        【回答规则】
            1. 禁止使用任何英文单词
            2. 必须包含以下4个部分：
        
        【花材组合】（2-3组）
        - 主花 + 配花
        
        【设计建议】
        - 造型: [花束(圆形或扇形)/花盒/花篮建议]
        - 包装: 包装材质和风格建议
        
        【花语寓意】
        
        【实用建议】
        - 养护: 1-2个养护方法
        - 替代方案: 1种类似风格替代选择 [简要说明区别]
        
        """,
                userInput,
                reference);
    }

    private final Map<String, String> occasionCache = new ConcurrentHashMap<>();
    private final Map<String, String> recipientCache = new ConcurrentHashMap<>();

    private static final Set<String> SPECIAL_KEYWORDS =
            Set.of("风格", "喜欢", "新颖", "特别", "创意");

    private String extractOccasion(String input) {
        if (input == null || SPECIAL_KEYWORDS.stream().anyMatch(input::contains)) {
            return "";
        }
        return occasionCache.computeIfAbsent(input.toLowerCase(), key -> {
            if (key.contains("生日")) return "生日";
            if (key.contains("婚礼") || key.contains("结婚")) return "婚礼";
            if (key.contains("求婚")) return "求婚";
            if (key.contains("探病") || key.contains("医院")) return "探病";
            return "";
        });
    }

    private String extractRecipient(String input) {
        if (input == null || SPECIAL_KEYWORDS.stream().anyMatch(input::contains)) {
            return "";
        }
        return recipientCache.computeIfAbsent(input.toLowerCase(), key -> {
            if (key.contains("爱人") || key.contains("女朋友") || key.contains("男朋友")) return "爱人";
            if (key.contains("母亲") || key.contains("妈妈")) return "母亲";
            if (key.contains("父亲") || key.contains("爸爸")) return "父亲";
            if (key.contains("老师")) return "老师";
            if (key.contains("领导") || key.contains("上司")) return "领导";
            if (key.contains("朋友") || key.contains("闺蜜") || key.contains("兄弟")) return "朋友";
            return "";
        });
    }
}