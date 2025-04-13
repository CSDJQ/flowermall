import { request } from '@/utils';
import {jwtDecode} from "jwt-decode";
import store from "@/store";

// 创建订单
export const createOrder = async (orderData) => {
    try {
        const res = await request.post('/order/submit', orderData);
        return {
            success: true,
            data: res.data,
            message: res.message || '订单创建成功'
        };
    } catch (error) {
        console.error('创建订单失败:', error);
        return {
            success: false,
            message: error.response?.data?.message || '订单创建失败'
        };
    }
};

// 获取订单详情
export const getOrderDetail = async (orderNumber) => {
    try {
        const res = await request.get(`/order/detail/${orderNumber}`);
        if (res.code === 200) {
            return res.data;
        }
        return null;
    } catch (error) {
        console.error('获取订单详情失败:', error);
        return null;
    }
};

// 更新订单状态 (管理员)
export const updateOrderStatus = async (orderNumber, status) => {
    try {
        const res = await request.put('/order/updateStatus', {
            orderNumber,
            status
        });
        return res.code === 200;
    } catch (error) {
        console.error('更新订单状态失败:', error);
        return false;
    }
};

// 获取订单列表（用户和管理员通用）
export const getOrders = async (params = {}) => {
    try {
        // 从token中获取isAdmin信息
        const token = store.getState().cus.token;
        const isAdmin = token ? jwtDecode(token).isAdmin : false;

        const endpoint = isAdmin ? '/order/admin/list' : '/order/list';

        // 转换状态参数
        const backendParams = {
            ...params,
            status: params.status === 'all' ? undefined : params.status,
            startTime: params.startTime,
            endTime: params.endTime,
            sortField: params.sortField === 'createdAt' ? 'created_at' : params.sortField,
            sortOrder: params.sortOrder
        };

        const res = await request.get(endpoint, { params: backendParams });

        if (res.code === 200) {
            // 统一处理数据结构
            if (isAdmin) {
                // 管理员接口返回 {list: [], total: X}
                return {
                    list: Array.isArray(res.data?.list) ? res.data.list : [],
                    total: res.data?.total || 0,
                    ...(res.data?.page && { page: res.data.page }),
                    ...(res.data?.pageSize && { pageSize: res.data.pageSize })
                };
            } else {
                // 普通用户接口返回 [...]
                return {
                    list: Array.isArray(res.data) ? res.data : [],
                    total: res.data?.length || 0
                };
            }
        }

        return { list: [], total: 0 }; // 默认返回统一结构
    } catch (error) {
        console.error('获取订单列表失败:', error);
        return { list: [], total: 0 }; // 错误时返回统一结构
    }
};