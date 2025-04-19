package com.backend.service;

import com.backend.annotation.ValidateFloralResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
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
    private final FloralKnowledgeBase knowledgeBase;
    private final String modelName;
    private final String apiUrl;
    private final double temperature;

    @Autowired
    public OllamaService(
            RestTemplate restTemplate,
            FloralKnowledgeBase knowledgeBase,
            @Value("${ollama.model}") String modelName,
            @Value("${ollama.api.url}") String apiUrl,
            @Value("${ollama.temperature}") double temperature) {
        this.restTemplate = restTemplate;
        this.knowledgeBase = knowledgeBase;
        this.modelName = modelName;
        this.apiUrl = apiUrl;
        this.temperature = temperature;

        log.info("OllamaService initialized with model: {}, endpoint: {}", modelName, apiUrl);
    }

    @Retryable(value = {RestClientException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    @Cacheable(value = "flowerRecommendations", key = "#userInput")
    @ValidateFloralResponse
    public String generateResponse(String userInput) {
        try {
            String enhancedPrompt = buildEnhancedPrompt(userInput);
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("prompt", enhancedPrompt);
            requestBody.put("temperature", temperature);
            requestBody.put("stream", false);

            return Optional.ofNullable(restTemplate.postForEntity(apiUrl, requestBody, Map.class).getBody())
                    .map(body -> (String) body.get("response"))
                    .orElseThrow(() -> new RuntimeException("Empty response from Ollama API"));
        } catch (Exception e) {
            log.error("生成失败 | 输入: {} | 错误: {}", userInput, e.getMessage());
            throw e;
        }
    }

    private String buildEnhancedPrompt(String userInput) {
        String occasion = extractOccasion(userInput);
        String flower = extractMainFlower(userInput);
        String recipient = extractRecipient(userInput);

        return String.format("""
            你是花艺小助手，请为顾客提供专业的购花建议。只能使用中文回答，不要用英文，并按照以下格式回复：
            
            ### 推荐花材组合[2-3种组合]
            - 主花: [说明选择理由]
            - 配花: [说明搭配理由]
            - 色彩: [色彩方案选择]
            
            ### 设计建议
            - 造型: [花束(圆形或扇形)/花盒/抱抱桶/花篮造型建议]
            - 包装: [包装风格建议]
            
            ### 花语寓意
            - [主花的花语解释]
            - [整体花束的象征意义]
            
            ### 实用建议
            - 养护: [养护注意事项]
            - 替代方案: [1-2种替代选择]
            
            用户需求:
            - 场合: %s
            - 收花人: %s
            - 偏好花材: %s
            
            专业参考:
            - 花语: %s
            - 场合建议: %s
            - 收花人建议: %s
            """,
                occasion,
                recipient,
                flower.isEmpty() ? "未指定" : flower,
                flower.isEmpty() ? "无" : knowledgeBase.getFlowerMeaning(flower),
                knowledgeBase.getOccasionAdvice(occasion),
                knowledgeBase.getRecipientAdvice(recipient));
    }

    private String extractOccasion(String input) {
        if (input == null) return "通用";
        input = input.toLowerCase();
        if (input.contains("生日")) return "生日";
        if (input.contains("婚礼") || input.contains("结婚")) return "婚礼";
        if (input.contains("求婚")) return "求婚";
        if (input.contains("探病") || input.contains("医院")) return "探病";
        return "通用";
    }

    private String extractMainFlower(String input) {
        if (input == null) return "";
        for (String flower : knowledgeBase.getAllFlowerMeaning().keySet()) {
            if (input.contains(flower)) {
                return flower;
            }
        }
        return "";
    }

    private String extractRecipient(String input) {
        if (input == null) return "通用";
        input = input.toLowerCase();
        if (input.contains("母亲") || input.contains("妈妈")) return "母亲";
        if (input.contains("父亲") || input.contains("爸爸")) return "父亲";
        if (input.contains("老师")) return "老师";
        if (input.contains("领导") || input.contains("上司")) return "领导";
        if (input.contains("朋友") || input.contains("闺蜜") || input.contains("兄弟")) return "朋友";
        if (input.contains("爱人") || input.contains("女朋友") || input.contains("男朋友")) return "爱人";
        return "通用";
    }
}