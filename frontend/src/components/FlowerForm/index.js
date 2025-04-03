import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Switch, Input, Select } from 'antd';
import ImageUploader from '@/components/ImageUploader';

const { Option } = Select;

// 定义选项数据
const flowerOptions = {
    mainFlower: [
        { value: '红玫瑰', label: '红玫瑰' },
        { value: '粉玫瑰', label: '粉玫瑰' },
        { value: '白玫瑰', label: '白玫瑰' },
        { value: '香槟玫瑰', label: '香槟玫瑰' },
        { value: '康乃馨', label: '康乃馨' },
        { value: '百合', label: '百合' },
        { value: '向日葵', label: '向日葵' },
        { value: '绣球花', label: '绣球花' },
        { value: '其他', label: '其他' }
    ],
    purpose: [
        { value: '爱情鲜花', label: '爱情鲜花' },
        { value: '友情鲜花', label: '友情鲜花' },
        { value: '生日鲜花', label: '生日鲜花' },
        { value: '长辈亲戚', label: '长辈亲戚' },
        { value: '师恩难忘', label: '师恩难忘' },
        { value: '祝贺鲜花', label: '祝贺鲜花' },
        { value: '哀思鲜花', label: '哀思鲜花' },
        { value: '商务桌花', label: '商务桌花' },
        { value: '开业花篮', label: '开业花篮' }
    ],
    colorScheme: [
        { value: '红色', label: '红色' },
        { value: '粉色', label: '粉色' },
        { value: '香槟', label: '香槟' },
        { value: '黄色', label: '黄色' },
        { value: '白色', label: '白色' },
        { value: '紫色', label: '紫色' },
        { value: '蓝色', label: '蓝色' },
        { value: '绿色', label: '绿色' },
        { value: '其他色系', label: '其他色系' }
    ],
    stemCount: [
        { value: '6枝', label: '6枝' },
        { value: '9枝', label: '9枝' },
        { value: '11枝', label: '11枝' },
        { value: '19枝', label: '19枝' },
        { value: '33枝', label: '33枝' },
        { value: '52枝', label: '52枝' },
        { value: '66枝', label: '66枝' },
        { value: '99枝', label: '99枝' },
        { value: '199枝', label: '199枝' }
    ]
};

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
        form.setFieldsValue({ imageUrl });
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
            width={800}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="鲜花名称" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="描述">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item name="originalPrice" label="原价" rules={[{ required: true }]}>
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        onChange={handleOriginalPriceChange}
                        formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
                <Form.Item label="折扣">
                    <Select
                        placeholder="选择折扣（1-10折）"
                        onChange={handleDiscountChange}
                        value={discount}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        {[...Array(10).keys()].map((i) => (
                            <Option key={i + 1} value={i + 1}>
                                {i + 1}折
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="discountPrice" label="折后价">
                    <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        value={discountPrice}
                        onChange={handleDiscountPriceChange}
                        formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                </Form.Item>
                <Form.Item name="isOnSale" label="是否在售" valuePropName="checked">
                    <Switch />
                </Form.Item>
                <Form.Item name="imageUrl" label="图片">
                    <ImageUploader
                        onUploadSuccess={handleUploadSuccess}
                        initialImage={currentFlower?.imageUrl}
                    />
                </Form.Item>
                {!currentFlower && (
                    <>
                        <Form.Item name="mainFlower" label="主花">
                            <Select
                                placeholder="请选择主花"
                                options={flowerOptions.mainFlower}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item name="purpose" label="用途">
                            <Select
                                placeholder="请选择用途"
                                options={flowerOptions.purpose}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item name="colorScheme" label="色系">
                            <Select
                                placeholder="请选择色系"
                                options={flowerOptions.colorScheme}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item name="stemCount" label="支数">
                            <Select
                                placeholder="请选择支数"
                                options={flowerOptions.stemCount}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default FlowerForm;