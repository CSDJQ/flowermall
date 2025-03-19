import React, {useEffect} from 'react';
import { Modal, Form, InputNumber, Input } from 'antd';

const CategoryForm = ({ visible, onCancel, onSubmit, currentCategory }) => {
    const [form] = Form.useForm();

    // 初始化表单值
    useEffect(() => {
        if (currentCategory) {
            form.setFieldsValue(currentCategory);
        } else {
            form.resetFields();
        }
    }, [currentCategory, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit({categoryId: currentCategory.categoryId, ...values});
        } catch (error) {
            console.error('表单验证失败', error);
        }
    };

    return (
        <Modal
            title="编辑种类"
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="mainFlower" label="主花">
                    <Input />
                </Form.Item>
                <Form.Item name="purpose" label="用途">
                    <Input />
                </Form.Item>
                <Form.Item name="colorScheme" label="色系">
                    <Input />
                </Form.Item>
                <Form.Item name="stemCount" label="支数">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryForm;