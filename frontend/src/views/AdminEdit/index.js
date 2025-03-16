import React, { useState } from 'react';
import { Form, message } from 'antd';
import { addFlower } from '@/apis/flower';
import FlowerTable from "@/components/FlowerTable";
import style from "./AdminEdit.module.scss";

const AdminEdit = () => {
    // const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // 处理表单提交
    const handleSubmit = async (values) => {
        setLoading(true);
        console.log(values);
        try {
            // 构造请求参数
            const flowerWithCategory = {
                ...values,
                mainFlower: values.mainFlower,
                purpose: values.purpose,
                colorScheme: values.colorScheme,
                stemCount: values.stemCount,
                isOnSale: values.isOnSale || false,// 设置默认值
            };

            // 调用后端接口
            await addFlower(flowerWithCategory);
            message.success('鲜花添加成功');
            // form.resetFields(); // 清空表单
        } catch (error) {
            message.error('鲜花添加失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.container}>
            <FlowerTable onSubmit={handleSubmit} loading={loading} />
        </div>
    );
};

export default AdminEdit;