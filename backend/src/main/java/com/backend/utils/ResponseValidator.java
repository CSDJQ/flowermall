package com.backend.utils;

public class ResponseValidator {
    public static boolean isValidFormat(String response) {
        return response.matches(
                "(?s).*1\\..*推荐花材.*\\n" +
                        "2\\..*设计建议.*\\n" +
                        "3\\..*花语寓意.*"
        );
    }

    public static String getFallbackResponse() {
        return "请提供更明确的描述，例如：'送母亲生日花束，她喜欢粉色'";
    }
}