import {request} from "../utils";

/**
 * 获取鲜花详情
 * @param {number} id - 鲜花 ID
 * @returns {Promise} - 返回鲜花详情
 */
export const fetchFlowerDetail = async (id) => {
    try {
        const response = await request.get(`/flower/${id}`);
        return response;
    } catch (error) {
        console.error('获取鲜花详情失败:', error);
        throw error;
    }
};

/**
 * 更新鲜花信息
 * @param {number} id - 鲜花 ID
 * @param {Object} values - 更新的鲜花信息
 * @returns {Promise} - 返回更新结果
 */
export const updateFlower = async (id, values) => {
    try {
        const response = await request.put(`/flower/${id}`, values);
        return response;
    } catch (error) {
        console.error('更新鲜花信息失败:', error);
        throw error;
    }
};

/**
 * 上传图片
 * @param {FormData} formData - 包含图片文件的 FormData
 * @returns {Promise} - 返回图片 URL
 */
export const uploadImage = async (formData) => {
    try {
        const response = await request.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('图片上传失败:', error);
        throw error;
    }
};