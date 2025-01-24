package com.backend.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cus {
    private Integer cusId;// 客户id
    private String username;// 用户名
    private String phone;// 手机
//    private String passwordHash;
//    private String passwordSalt;
    private String password;
}

