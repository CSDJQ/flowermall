package com.backend.utils;

import java.util.Arrays;
import java.util.List;

public class ResponseValidator {
    private static final List<String> REQUIRED_SECTIONS = Arrays.asList(
            "推荐花材组合",
            "设计建议",
            "花语寓意",
            "实用建议"
    );

    private static final List<String> REQUIRED_KEYWORDS = Arrays.asList(
            "主花", "配花", "色彩", "造型",
            "花语", "包装"
    );

    public static boolean isValidFormat(String response) {
        if (response == null || response.trim().isEmpty()) {
            return false;
        }

        // 检查是否包含所有必需部分
        boolean hasAllSections = REQUIRED_SECTIONS.stream()
                .allMatch(section -> response.contains(section));

        // 检查是否有足够的内容细节
        boolean hasEnoughContent = response.split("\n").length > 10;

        // 检查是否包含足够的关键词
        long keywordCount = REQUIRED_KEYWORDS.stream()
                .filter(keyword -> response.contains(keyword))
                .count();

        // 检查是否有明显的错误标记
        boolean hasErrorMarkers = response.contains("抱歉") ||
                response.contains("无法") ||
                response.contains("不知道");

        return hasAllSections && hasEnoughContent && (keywordCount >= 3) && !hasErrorMarkers;
    }

    public static String getFallbackResponse() {
        return """
               请提供更明确的描述，例如：
               - "想送母亲生日花束，她喜欢粉色"
               - "求婚用花，想要浪漫风格"
               - "朋友开业，想要大气一些的花篮"
               
               您可以告诉我：
               1. 收花人与您的关系
               2. 具体场合
               3. 喜欢的颜色或花材
               4. 任何特殊要求
               """;
    }
}