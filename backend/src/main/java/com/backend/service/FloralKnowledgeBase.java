package com.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class FloralKnowledgeBase {
    private Map<String, String> flowerMeanings = new HashMap<>();
    private Map<String, String> occasionAdvice = new HashMap<>();
    private Map<String, String> recipientAdvice = new HashMap<>();

    @Value("classpath:static/floral_knowledge.json")
    private Resource knowledgeFile;

    @PostConstruct
    public void init() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String content = new String(Files.readAllBytes(knowledgeFile.getFile().toPath()));
        Map<String, Map<String, String>> knowledge = mapper.readValue(content, Map.class);

        this.flowerMeanings = knowledge.get("flowerMeanings");
        this.occasionAdvice = knowledge.get("occasionAdvice");
        this.recipientAdvice = knowledge.get("recipientAdvice");
    }

    public String getFlowerMeaning(String flower) {
        return flowerMeanings.getOrDefault(flower, "暂无此花的花语信息，请联网搜索");
    }

    public Map<String, String> getAllFlowerMeaning() {
        return flowerMeanings;
    }

    public String getOccasionAdvice(String occasion) {
        return occasionAdvice.getOrDefault(occasion, "通用场合：混合花束，色彩协调即可");
    }

    public String getRecipientAdvice(String recipient) {
        return recipientAdvice.getOrDefault(recipient, "通用建议：根据收花人的喜好选择花材");
    }

}