package com.backend.controller;

import com.backend.pojo.StsTokenResponse;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.sts.v20180813.StsClient;
import com.tencentcloudapi.sts.v20180813.models.GetFederationTokenRequest;
import com.tencentcloudapi.sts.v20180813.models.GetFederationTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sts")
public class StsController {
    // 腾讯云COS的token

    @Value("${tencent.cloud.secretId}")
    private String secretId;

    @Value("${tencent.cloud.secretKey}")
    private String secretKey;

    @Value("${tencent.cloud.region}")
    private String region;

    @Value("${tencent.cloud.bucket}")
    private String bucket;

    @GetMapping("/token")
    public StsTokenResponse getStsToken() throws TencentCloudSDKException {
        // 初始化认证对象
        Credential cred = new Credential(secretId, secretKey);

        // 配置 HTTP 请求
        HttpProfile httpProfile = new HttpProfile();
        httpProfile.setEndpoint("sts.tencentcloudapi.com");

        // 配置客户端
        ClientProfile clientProfile = new ClientProfile();
        clientProfile.setHttpProfile(httpProfile);

        // 初始化 STS 客户端
        StsClient client = new StsClient(cred, region, clientProfile);

        // 构建请求
        GetFederationTokenRequest req = new GetFederationTokenRequest();
        req.setName("temp-credential"); // 临时凭证名称
        req.setPolicy(getPolicy()); // 设置权限策略
        req.setDurationSeconds(1800L); // 临时凭证有效期，单位：秒

        // 发送请求并获取响应
        GetFederationTokenResponse response = client.GetFederationToken(req);

        return new StsTokenResponse(
                response.getExpiration(),
                response.getRequestId(),
                new StsTokenResponse.Credentials(
                        response.getCredentials().getTmpSecretId(),
                        response.getCredentials().getTmpSecretKey(),
                        response.getCredentials().getToken()
                ),
                response.getExpiredTime()
        );
    }

    // 生成权限策略
    private String getPolicy() {
        return String.format(
                "{\"version\":\"2.0\",\"statement\":[{\"effect\":\"allow\",\"action\":[\"name/cos:PutObject\",\"name/cos:GetObject\",\"name/cos:DeleteObject\"],\"resource\":[\"qcs::cos:%s:uid/%s:%s/*\"]}]}",
                region, "1346990013", bucket
        );
    }
}