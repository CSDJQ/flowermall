import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Flex, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getToken, removeToken } from "@/utils/token";
import { setToken } from "@/store/modules/cus";
import { validateToken } from "@/apis/auth"; // 假设有一个验证 Token 的 API

export function AuthRoute({ children }) {
    const dispatch = useDispatch();
    const TOKEN = getToken(); // 从 localStorage 中获取 Token
    const reduxToken = useSelector(state => state.cus.token); // 从 Redux 中获取 Token
    const [isAuthenticated, setIsAuthenticated] = useState(null); // 认证状态

    // 验证 Token 是否有效
    const checkTokenValidity = async () => {
        if (!TOKEN) {
            setIsAuthenticated(false); // 如果没有 Token，设置为未认证
            return;
        }

        try {
            const isValid = await validateToken(TOKEN); // 调用 API 验证 Token 是否有效
            setIsAuthenticated(isValid); // 根据验证结果设置认证状态
            if (!isValid) {
                dispatch(setToken("")); // 清空 Redux 中的 Token
                removeToken(); // 清除 localStorage 中的 Token
            }
        } catch (error) {
            console.error("Token 验证失败:", error);
            setIsAuthenticated(false); // 如果验证失败，设置为未认证
            dispatch(setToken("")); // 清空 Redux 中的 Token
            removeToken(); // 清除 localStorage 中的 Token
        }
    };

    // 当 Token 发生变化时，验证 Token 有效性
    useEffect(() => {
        checkTokenValidity();
    }, [TOKEN]);

    // 如果认证状态尚未确定，显示加载中
    if (isAuthenticated === null) {
        return (
            <Flex align="center" justify="center" style={{ height: "100vh" }}>
                <Spin size="large" />
            </Flex>
        );
    }

    // 如果认证通过，渲染子组件
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // 如果未认证，跳转到登录界面
    return <Navigate to="/login" replace />;
}