package com.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

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
        try (InputStream inputStream = knowledgeFile.getInputStream()) {
            Map<String, Map<String, String>> knowledge = mapper.readValue(inputStream, new TypeReference<Map<String, Map<String, String>>>() {});
            this.flowerMeanings = knowledge.getOrDefault("花材库", new HashMap<>());
            this.occasionAdvice = knowledge.getOrDefault("场景", new HashMap<>());
            this.recipientAdvice = knowledge.getOrDefault("收花人", new HashMap<>());
        }
    }

    public Map<String, String> getAllFlowerMeaning() {
        return flowerMeanings;
    }

    public String getOccasionAdvice(String occasion) {
        return occasionAdvice.getOrDefault(occasion, "通用场合,色彩协调即可");
    }

    public String getRecipientAdvice(String recipient) {
        return recipientAdvice.getOrDefault(recipient, "根据收花人的喜好和风格选择花材");
    }

}