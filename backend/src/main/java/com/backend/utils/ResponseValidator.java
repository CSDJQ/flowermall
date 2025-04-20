package com.backend.utils;

import java.util.Arrays;
import java.util.List;

public class ResponseValidator {

    public static boolean isValidFormat(String response) {
        if (response == null || response.trim().isEmpty()) {
            return false;
        }

        // 检查基本结构
        boolean hasRequiredParts =
                response.contains("花材组合") &&
                        response.contains("设计建议") &&
                        response.contains("花语寓意") &&
                        response.contains("实用建议");

        // 检查内容完整性
        boolean hasEnoughContent = response.split("\n").length > 10;

        return hasRequiredParts && hasEnoughContent;
    }

    public static String getFallbackResponse() {
        return """
           您好！为了更好地为您推荐花束，请提供以下信息：
           
           【必填信息】
           1. 这是送给谁的？(例如：母亲、爱人、朋友)
           2. 用于什么场合？(例如：生日、纪念日、探病)
           
           【选填信息】
           3. 喜欢的颜色或花材
           4. 特殊要求(如预算、花束大小等)
           5. 收花人的年龄或职业(如有特殊需求)
           
           示例：
           - "朋友新店开业，想要大气吉祥的花篮"
           """;
    }
}