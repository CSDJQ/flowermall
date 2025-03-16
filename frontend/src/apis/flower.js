import { request } from '@/utils';

// // 上传图片
// export const uploadImage = async (formData) => {
//     return request.post('/upload', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data',
//         },
//     });
// };


// 获取所有鲜花
export const getFlowers = async () => {
    return request.get('/flowers');
};

// 删除鲜花
export const deleteFlower = async (flowerId) => {
    return request.delete(`/flowers/${flowerId}`);
};

// 添加鲜花
export const addFlower = async (flowerWithCategory) => {
    return request.post('/flowers', flowerWithCategory);
};

// 更新鲜花
export const updateFlower = async (flower) => {
    return request.put('/flowers', flower);
};

export const updateCategory = async (flowerId) => {

}
export const getCategory = async (flowerId) => {

}