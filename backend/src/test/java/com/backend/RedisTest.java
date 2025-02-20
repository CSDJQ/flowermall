//package com.backend;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.data.redis.core.StringRedisTemplate;
//import org.springframework.data.redis.core.ValueOperations;
//
//@SpringBootTest // 单元测试方法执行之前，先初始化Spring容器
//public class RedisTest {
//    @Autowired
//    private StringRedisTemplate stringRedisTemplate;
//
//    @Test
//    public void testSet() {
//        // 往redis中存储一个键值对
//        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
//        ops.set("username", "zhangsan");
//    }
//}
