import { request } from '@/utils';

// 创建订单API
export const createOrder = async (orderData) => {
    try {
        const response = await request.post('/api/orders', orderData);
        return response.data; // { success: true, orderId: '123', ... }
    } catch (error) {
        throw error;
    }
};