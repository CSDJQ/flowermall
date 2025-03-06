import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Switch, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFlowerDetail, updateFlower, uploadImage } from '../../apis/flower';

const AdminEdit = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 获取鲜花详情
    useEffect(() => {
        const loadFlowerDetail = async () => {
            try {
                const response = await fetchFlowerDetail(id);
                form.setFieldsValue(response.data); // 填充表单
            } catch (error) {
                message.error('获取鲜花详情失败');
            }
        };
        loadFlowerDetail();
    }, [id, form]);

    // 处理图片上传
    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await uploadImage(formData);
            form.setFieldsValue({ image_url: response.data.url }); // 更新图片 URL
            message.success('图片上传成功');
        } catch (error) {
            message.error('图片上传失败');
        }
    };

    // 提交表单
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await updateFlower(id, values);
            message.success('鲜花信息更新成功');
            navigate('/admin/flowers'); // 返回鲜花列表页
        } catch (error) {
            message.error('鲜花信息更新失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item name="name" label="鲜花名称" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="description" label="鲜花描述">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="original_price" label="原价" rules={[{ required: true }]}>
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="discount_price" label="折后价">
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="is_on_sale" label="是否在售" valuePropName="checked">
                <Switch />
            </Form.Item>
            <Form.Item name="image_url" label="鲜花图片">
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleUpload}
                >
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    保存
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AdminEdit;