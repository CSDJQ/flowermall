import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Switch, Upload, Button, Input, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const FlowerForm = ({ visible, onCancel, onSubmit, currentFlower }) => {
    const [form] = Form.useForm();
    const [discount, setDiscount] = useState(null); // 折扣值（1-10）
    const [discountPrice, setDiscountPrice] = useState(null); // 折后价
    const [originalPrice, setOriginalPrice] = useState(null); // 原价

    // 初始化表单值和状态
    useEffect(() => {
        if (visible) {
            if (currentFlower) {
                // 编辑模式：初始化表单值为当前鲜花数据
                form.setFieldsValue(currentFlower);
                setOriginalPrice(currentFlower.originalPrice);
                setDiscountPrice(currentFlower.discountPrice);
                // 如果原价和折后价都存在，计算折扣
                if (currentFlower.originalPrice && currentFlower.discountPrice) {
                    const calculatedDiscount = (currentFlower.discountPrice / currentFlower.originalPrice) * 10;
                    setDiscount(calculatedDiscount);
                }
            } else {
                // 添加模式：清空表单和状态
                form.resetFields();
                setOriginalPrice(null);
                setDiscountPrice(null);
                setDiscount(null); // 清空折扣
            }
        }
        // 无论模态框是否可见，都清空折扣状态
        setDiscount(null);
    }, [visible, currentFlower, form]);

    // 处理折扣选择
    const handleDiscountChange = (value) => {
        setDiscount(value);
        if (originalPrice && value) {
            const calculatedPrice = (originalPrice * value) / 10; // 计算折后价
            const formattedPrice = parseFloat(calculatedPrice.toFixed(2)); // 保留两位小数
            setDiscountPrice(formattedPrice);
            form.setFieldsValue({ discountPrice: formattedPrice }); // 更新表单值
        }
    };

    // 处理原价变化
    const handleOriginalPriceChange = (value) => {
        setOriginalPrice(value);
        if (discount && value) {
            const calculatedPrice = (value * discount) / 10; // 计算折后价
            const formattedPrice = parseFloat(calculatedPrice.toFixed(2)); // 保留两位小数
            setDiscountPrice(formattedPrice);
            form.setFieldsValue({ discountPrice: formattedPrice }); // 更新表单值
        }
    };

    // 处理折后价变化
    const handleDiscountPriceChange = (value) => {
        const formattedPrice = parseFloat(value.toFixed(2)); // 保留两位小数
        setDiscountPrice(formattedPrice);
        if (originalPrice && formattedPrice) {
            const calculatedDiscount = (formattedPrice / originalPrice) * 10; // 计算折扣
            setDiscount(calculatedDiscount);
        }
    };

    // 提交表单
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
        } catch (error) {
            console.error('表单验证失败', error);
        }
    };

    return (
        <Modal
            title={currentFlower ? '编辑鲜花' : '添加鲜花'}
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="鲜花名称" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="描述">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name="originalPrice"
                    label="原价"
                    rules={[{ required: true }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        onChange={handleOriginalPriceChange}
                    />
                </Form.Item>
                <Form.Item label="折扣">
                    <Select
                        placeholder="选择折扣（1-10折）"
                        onChange={handleDiscountChange}
                        value={discount} // 绑定到 discount 状态
                        allowClear // 允许清空选择
                    >
                        {[...Array(10).keys()].map((i) => (
                            <Option key={i + 1} value={i + 1}>
                                {i + 1}折
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="discountPrice"
                    label="折后价"
                >
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        value={discountPrice}
                        onChange={handleDiscountPriceChange}
                    />
                </Form.Item>
                <Form.Item name="isOnSale" label="是否在售" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item name="imageUrl" label="图片">
                    <Upload
                        action="https://your-cos-upload-endpoint"
                        listType="picture"
                        maxCount={1}
                        onChange={(info) => {
                            if (info.file.status === 'done') {
                                form.setFieldsValue({ imageUrl: info.file.response.url });
                            }
                        }}
                    >
                        <Button icon={<UploadOutlined />}>上传图片</Button>
                    </Upload>
                </Form.Item>
                {!currentFlower && (
                    <>
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
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default FlowerForm;