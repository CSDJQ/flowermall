import React, { useState } from 'react';
import {
    Card, Button, Modal, Tabs, Form, Input,
    Checkbox, Space, Typography, message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
    getShippingAddresses,
    addShippingAddress,
    setDefaultAddress
} from '@/apis/user';
import style from './AddressSelector.module.scss';

const { Text } = Typography;

const AddressSelector = ({
                             selectedAddress,
                             setSelectedAddress,
                             fetchDefaultAddress
                         }) => {
    const [addresses, setAddresses] = useState([]);
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [addressForm] = Form.useForm();

    // 获取用户地址列表
    const fetchAllAddresses = async () => {
        setLoadingAddresses(true);
        try {
            const res = await getShippingAddresses();
            if (res.code === 200) {
                setAddresses(res.data);
            }
        } catch (error) {
            console.error('获取地址失败', error);
            message.error('获取地址失败');
        } finally {
            setLoadingAddresses(false);
        }
    };

    // 添加新地址
    const handleAddAddress = async () => {
        try {
            const values = await addressForm.validateFields();
            const res = await addShippingAddress(values);

            if (res.code === 200) {
                message.success('地址添加成功');
                setAddressModalVisible(false);
                addressForm.resetFields();
                await fetchAllAddresses();
                setSelectedAddress(values);
                if (values.isDefault) {
                    await fetchDefaultAddress();
                }
            }
        } catch (error) {
            if (!error.errorFields) {
                message.error('添加地址失败');
            }
        }
    };

    // 设置默认地址
    const handleSetDefault = async (addressId) => {
        try {
            const res = await setDefaultAddress(addressId);
            if (res.code === 200) {
                message.success('默认地址设置成功');
                await fetchDefaultAddress();
                await fetchAllAddresses();
            }
        } catch (error) {
            message.error('设置默认地址失败');
        }
    };

    // 打开地址选择模态框
    const handleOpenAddressModal = () => {
        setAddressModalVisible(true);
        setIsEditingAddress(false);
        fetchAllAddresses();
    };

    // 地址管理模态框内容
    const renderAddressManager = () => {
        const tabItems = [
            {
                key: 'select',
                label: '选择地址',
                children: loadingAddresses ? (
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                        <Text type="secondary">加载地址中...</Text>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className={style.emptyAddress}>
                        <Text type="secondary">暂无地址，请添加新地址</Text>
                        <Button
                            type="primary"
                            onClick={() => setIsEditingAddress(true)}
                        >
                            <PlusOutlined /> 添加地址
                        </Button>
                    </div>
                ) : (
                    <div className={style.addressList}>
                        {addresses.map(address => (
                            <div
                                key={address.addressId}
                                className={`${style.addressItem} ${selectedAddress?.addressId === address.addressId ? style.selected : ''}`}
                                onClick={() => {
                                    setSelectedAddress(address);
                                    setAddressModalVisible(false);
                                }}
                            >
                                <div className={style.addressInfo}>
                                    <Text strong>{address.receiverName}</Text>
                                    <Text className={style.phone}>{address.receiverPhone}</Text>
                                    <div className={style.fullAddress}>
                                        {address.district} {address.detailedAddress}
                                        {address.isDefault && (
                                            <Text className={style.defaultTag}>[默认]</Text>
                                        )}
                                    </div>
                                </div>
                                <Space>
                                    {!address.isDefault && (
                                        <Button
                                            type="link"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSetDefault(address.addressId);
                                            }}
                                        >
                                            设为默认
                                        </Button>
                                    )}
                                </Space>
                            </div>
                        ))}
                    </div>
                )
            },
            {
                key: 'add',
                label: '新增地址',
                children: (
                    <Form form={addressForm} layout="vertical" className={style.addressForm}>
                        <Form.Item
                            name="receiverName"
                            label="收货人姓名"
                            rules={[{ required: true, message: '请输入收货人姓名' }]}
                        >
                            <Input placeholder="请输入收货人姓名" />
                        </Form.Item>
                        <Form.Item
                            name="receiverPhone"
                            label="收货人电话"
                            rules={[
                                { required: true, message: '请输入收货人电话' },
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                            ]}
                        >
                            <Input placeholder="请输入收货人电话" />
                        </Form.Item>
                        <Form.Item
                            name="district"
                            label="区/县"
                            rules={[{ required: true, message: '请输入区/县信息' }]}
                        >
                            <Input placeholder="例如：番禺区" />
                        </Form.Item>
                        <Form.Item
                            name="detailedAddress"
                            label="详细地址"
                            rules={[{ required: true, message: '请输入详细地址' }]}
                        >
                            <Input.TextArea placeholder="例如：华南理工大学大学城校区" rows={3} />
                        </Form.Item>
                        <Form.Item
                            name="isDefault"
                            label="是否默认地址"
                            valuePropName="checked"
                        >
                            <Checkbox>设为默认地址</Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={handleAddAddress}
                                >
                                    添加地址
                                </Button>
                                <Button onClick={() => {
                                    setAddressModalVisible(false);
                                    addressForm.resetFields();
                                }}>
                                    取消
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                )
            }
        ];

        return (
            <div className={style.addressManager}>
                <Tabs
                    activeKey={isEditingAddress ? "add" : "select"}
                    onChange={(key) => setIsEditingAddress(key === 'add')}
                    items={tabItems}
                />
            </div>
        );
    };

    // 渲染地址选择区域
    const renderAddressSection = () => (
        <Card
            className={style.addressCard}
            title="收货地址"
            extra={
                <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setAddressModalVisible(true);
                        setIsEditingAddress(true);
                        addressForm.resetFields();
                    }}
                >
                    新增地址
                </Button>
            }
        >
            {selectedAddress ? (
                <div className={style.selectedAddress}>
                    <Text strong>{selectedAddress.receiverName}</Text>
                    <Text className={style.phone}>{selectedAddress.receiverPhone}</Text>
                    <div className={style.fullAddress}>
                        {selectedAddress.district} {selectedAddress.detailedAddress}
                        {selectedAddress.isDefault && (
                            <Text className={style.defaultTag}>[默认]</Text>
                        )}
                    </div>
                    <Button
                        type="link"
                        onClick={handleOpenAddressModal}
                    >
                        更改地址
                    </Button>
                </div>
            ) : (
                <div className={style.noAddress}>
                    <Text>请选择收货地址</Text>
                    <Button
                        type="primary"
                        onClick={handleOpenAddressModal}
                    >
                        选择地址
                    </Button>
                </div>
            )}
        </Card>
    );

    return (
        <>
            {renderAddressSection()}

            <Modal
                title="管理收货地址"
                open={addressModalVisible}
                onCancel={() => {
                    setAddressModalVisible(false);
                    addressForm.resetFields();
                    setIsEditingAddress(false);
                }}
                footer={null}
                width={800}
                destroyOnClose
            >
                {renderAddressManager()}
            </Modal>
        </>
    );
};

export default AddressSelector;