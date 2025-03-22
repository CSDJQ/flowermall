package com.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StsTokenResponse {
    private String expiration; // 过期时间（ISO 8601 格式）
    private String requestId; // 请求 ID
    private Credentials credentials; // 临时密钥信息
    private Long expiredTime; // 过期时间戳（秒）

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Credentials {
        private String tmpSecretId; // 临时 SecretId
        private String tmpSecretKey; // 临时 SecretKey
        private String token; // 临时 Token
    }
}