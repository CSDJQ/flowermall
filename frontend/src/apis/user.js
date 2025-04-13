import { request } from '@/utils';

// 获取用户信息
export const getUserInfo = async () => {
    return request.get('/user/info');
};

// 更新用户信息
export const updateUserInfo = async (userInfo) => {
    let result = await request.put('/user/updateInfo', userInfo);
    console.log(result);
    return result;
};

// 修改密码
export const changePassword = async (oldPassword, newPassword) => {
    return request.post('/user/updatePwd', { oldPassword, newPassword });
};

// 获取收货地址列表
export const getShippingAddresses = async () => {
    return request.get('/addresses');
};

// 添加收货地址
export const addShippingAddress = async (address) => {
    return request.post('/addresses', address);
};

// 更新收货地址
export const updateShippingAddress = async (address) => {
    return request.put('/addresses', address);
};

// 删除收货地址
export const deleteShippingAddress = async (addressId) => {
    return request.delete(`/addresses/${addressId}`);
};

// 设置默认收货地址
export const setDefaultAddress = async (addressId) => {
    let address = {
        addressId: addressId,
        isDefault: true,
    }
    return request.put(`/addresses`, address);
};

// 获取默认地址
export const getDefaultAddress = async () => {
    return request.get('/addresses/default');
}