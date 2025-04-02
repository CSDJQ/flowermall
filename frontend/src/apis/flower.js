import { request } from '@/utils';

// 获取所有鲜花
export const getFlowers = async () => {
    return request.get('/flowers');
};

// 删除鲜花
export const deleteFlower = async (flowerId) => {
    const res = await request.delete(`/flowers/${flowerId}`);
    if (res.code === 200){return true;}
    else return false;
};

// 添加鲜花
export const addFlower = async (flowerWithCategory) => {
    return await request.post('/flowers', flowerWithCategory);
};

export const updateFlower = async (flower) => {
    try {
        const res = await request.put('/flowers', flower);
        console.log('更新鲜花响应:', res);
        if (res.code === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('更新鲜花失败:', error);
        return false;
    }
};

export const updateCategory = async (category) => {
    try {
        const res = await request.put('/flowers/category', category);
        console.log('更新分类响应:', category);
        if (res.code === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('更新分类失败:', error);
        return false;
    }
};

export const getCategory = async (flowerId) => {
    try {
        return request.get(`/flowers/category/${flowerId}`);
    } catch (error) {
        console.error('获取分类失败:', error);
        return false;
    }
}

export const getFlowersByCategory = async (type, value) => {
    return request.get('/user/flowers/byCategory', { params: { type, value } })
}