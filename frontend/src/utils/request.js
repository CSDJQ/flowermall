import axios from 'axios';
import {getToken} from "./token";

// 配置
const request = axios.create({
    baseURL: 'http://127.0.0.1:8080',
    timeout: 5000,
})

// 请求拦截器
request.interceptors.request.use ((config) =>{
    // 获取token并注入
    const TOKEN = getToken();
    if(TOKEN){
        config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
},(error) => {
    return Promise.reject(error);
})

// 响应拦截器
request.interceptors.response.use( (response) => {
    if(response.status === 200){

    }
    return response.data;
},(error) => {
    if (error.response && error.response.status === 401) {
        // Token 无效或过期，跳转到登录界面
        window.location.href = "/login";
    }
    return Promise.reject(error);
})

export {request}