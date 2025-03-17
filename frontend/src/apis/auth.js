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
        const response = await request.get('/api/token/validate'); // 调用验证接口
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
 * @returns {Promise<string|null>} 新的 Token，如果刷新失败返回 null
 */
export const refreshToken = async () => {

};

/**
 * 检查 Token 是否有效，如果无效尝试刷新 Token
 * @returns {Promise<boolean>} 是否有效
 */
export const checkAndRefreshToken = async (token) => {
    const isValid = await validateToken(token); // 验证 Token 是否有效
    if (isValid) {
        return true; // 如果有效，直接返回 true
    }

    const newToken = await refreshToken(); // 尝试刷新 Token
    return !!newToken; // 如果刷新成功，返回 true；否则返回 false
};