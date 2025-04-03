import React, { useEffect } from 'react';
import { Modal, Form, Select } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

// 定义选项数据
const guideContents = [
    {
        key: 'purpose',
        icon: <SmileOutlined />,
        label: '用途',
        children: [
            { key: '爱情鲜花', label: '爱情鲜花' },
            { key: '友情鲜花', label: '友情鲜花' },
            { key: '生日鲜花', label: '生日鲜花' },
            { key: '长辈亲戚', label: '长辈亲戚' },
            { key: '师恩难忘', label: '师恩难忘' },
            { key: '祝贺鲜花', label: '祝贺鲜花' },
            { key: '哀思鲜花', label: '哀思鲜花' },
            { key: '商务桌花', label: '商务桌花' },
            { key: '开业花篮', label: '开业花篮' },
        ],
    },
    {
        key: 'mainFlower',
        icon: <SmileOutlined />,
        label: '主花',
        children: [
            { key: '红玫瑰', label: '红玫瑰' },
            { key: '粉玫瑰', label: '粉玫瑰' },
            { key: '白玫瑰', label: '白玫瑰' },
            { key: '香槟玫瑰', label: '香蜂玫瑰' },
            { key: '康乃馨', label: '康乃馨' },
            { key: '百合', label: '百合' },
            { key: '向日葵', label: '向日葵' },
            { key: '绣球花', label: '绣球花' },
            { key: '其他', label: '其他' },
        ],
    },
    {
        key: 'colorScheme',
        icon: <SmileOutlined />,
        label: '色系',
        children: [
            { key: '红色', label: '红色' },
            { key: '粉色', label: '粉色' },
            { key: '香槟', label: '香槟' },
            { key: '黄色', label: '黄色' },
            { key: '白色', label: '白色' },
            { key: '紫色', label: '紫色' },
            { key: '蓝色', label: '蓝色' },
            { key: '绿色', label: '绿色' },
            { key: '其他色系', label: '其他色系' },
        ],
    },
    {
        key: 'stemCount',
        icon: <SmileOutlined />,
        label: '支数',
        children: [
            { key: '6枝', label: '6枝' },
            { key: '9枝', label: '9枝' },
            { key: '11枝', label: '11枝' },
            { key: '19枝', label: '19枝' },
            { key: '33枝', label: '33枝' },
            { key: '52枝', label: '52枝' },
            { key: '66枝', label: '66枝' },
            { key: '99枝', label: '99枝' },
            { key: '199枝', label: '199枝' },
        ],
    },
];

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
            onSubmit({ categoryId: currentCategory?.categoryId, ...values });
        } catch (error) {
            console.error('表单验证失败', error);
        }
    };

    // 获取选项数据
    const getOptions = (key) => {
        const category = guideContents.find(item => item.key === key);
        return category?.children.map(item => ({
            value: item.key,
            label: item.label
        })) || [];
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
                    <Select
                        placeholder="请选择主花"
                        options={getOptions('mainFlower')}
                    />
                </Form.Item>
                <Form.Item name="purpose" label="用途">
                    <Select
                        placeholder="请选择用途"
                        options={getOptions('purpose')}
                    />
                </Form.Item>
                <Form.Item name="colorScheme" label="色系">
                    <Select
                        placeholder="请选择色系"
                        options={getOptions('colorScheme')}
                    />
                </Form.Item>
                <Form.Item name="stemCount" label="支数">
                    <Select
                        placeholder="请选择支数"
                        options={getOptions('stemCount')}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryForm;