import { request } from '@/utils';

/**
 * 验证 Token 是否有效
 * @returns {Promise<boolean>} 是否有效
 */
export const validateToken = async (token) => {
    if (!token) {
        return false; // 如果 Token 不存在，直接返回 false
    }

    try {
        const response = await request.get('/token/validate'); // 调用验证接口
        return response.code === 200; // 如果返回 200，说明 Token 有效
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // 如果返回 401，说明 Token 无效或过期
            return false;
        }
        console.error("Token 验证失败:", error);
        return false;
    }
};

/**
 * 刷新 Token
 * @returns {Promise<string|null>} 新的 Token
 */
let remainingRefreshCount = 3; // 初始允许刷新3次

export const refreshToken = async () => {
    if (remainingRefreshCount <= 0) {
        clearTokenAutoRefresh();
        return null;
    }

    try {
        const response = await request.get('/token/refresh');
        if (response.code === 200) {
            remainingRefreshCount--; // 减少剩余次数
            return response.data;
        }
    } catch (error) {
        console.error("刷新 Token 失败:", error);
        return null;
    }
}

// 添加定时刷新逻辑（后端12小时有效期，11小时后刷新）
const REFRESH_INTERVAL = 11 * 60 * 60 * 1000; // 11小时
let refreshTimer = null;

export const setupTokenAutoRefresh = () => {
    if (refreshTimer) clearInterval(refreshTimer);

    refreshTimer = setInterval(async () => {
        if (await validateToken()) {
            await refreshToken();
        }
    }, REFRESH_INTERVAL);
}

export const clearTokenAutoRefresh = () => {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}