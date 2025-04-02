import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Switch, Input, Select } from 'antd';
import ImageUploader from '@/components/ImageUploader'; // 导入封装的上传组件

const { Option } = Select;

const FlowerForm = ({ visible, onCancel, onSubmit, currentFlower }) => {
    const [form] = Form.useForm();
    const [discount, setDiscount] = useState(null);
    const [discountPrice, setDiscountPrice] = useState(null);
    const [originalPrice, setOriginalPrice] = useState(null);

    // 初始化表单值和状态
    useEffect(() => {
        if (visible) {
            if (currentFlower) {
                form.setFieldsValue(currentFlower);
                setOriginalPrice(currentFlower.originalPrice);
                setDiscountPrice(currentFlower.discountPrice);
                if (currentFlower.originalPrice && currentFlower.discountPrice) {
                    const calculatedDiscount = (currentFlower.discountPrice / currentFlower.originalPrice) * 10;
                    setDiscount(calculatedDiscount);
                }
            } else {
                form.resetFields();
                setOriginalPrice(null);
                setDiscountPrice(null);
                setDiscount(null);
            }
        }
        setDiscount(null);
    }, [visible, currentFlower, form]);

    // 处理图片上传成功
    const handleUploadSuccess = (imageUrl) => {
        form.setFieldsValue({ imageUrl }); // 更新表单值
    };

    // 处理折扣选择
    const handleDiscountChange = (value) => {
        setDiscount(value);
        if (originalPrice && value) {
            const calculatedPrice = (originalPrice * value) / 10;
            const formattedPrice = parseFloat(calculatedPrice.toFixed(2));
            setDiscountPrice(formattedPrice);
            form.setFieldsValue({ discountPrice: formattedPrice });
        }
    };

    // 处理原价变化
    const handleOriginalPriceChange = (value) => {
        setOriginalPrice(value);
        if (discount && value) {
            const calculatedPrice = (value * discount) / 10;
            const formattedPrice = parseFloat(calculatedPrice.toFixed(2));
            setDiscountPrice(formattedPrice);
            form.setFieldsValue({ discountPrice: formattedPrice });
        }
    };

    // 处理折后价变化
    const handleDiscountPriceChange = (value) => {
        const formattedPrice = parseFloat(value.toFixed(2));
        setDiscountPrice(formattedPrice);
        if (originalPrice && formattedPrice) {
            const calculatedDiscount = (formattedPrice / originalPrice) * 10;
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
                <Form.Item name="originalPrice" label="原价" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} onChange={handleOriginalPriceChange} />
                </Form.Item>
                <Form.Item label="折扣">
                    <Select
                        placeholder="选择折扣（1-10折）"
                        onChange={handleDiscountChange}
                        value={discount}
                        allowClear
                    >
                        {[...Array(10).keys()].map((i) => (
                            <Option key={i + 1} value={i + 1}>
                                {i + 1}折
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="discountPrice" label="折后价">
                    <InputNumber min={0} style={{ width: '100%' }} value={discountPrice} onChange={handleDiscountPriceChange} />
                </Form.Item>
                <Form.Item name="isOnSale" label="是否在售" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item name="imageUrl" label="图片">
                    <ImageUploader
                        onUploadSuccess={handleUploadSuccess}
                        initialImage={currentFlower?.imageUrl} // 传递初始图片
                    />
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