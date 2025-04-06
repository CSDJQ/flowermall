// src/views/CartTable/index.js
import React, { useState, useEffect } from 'react';
import {
    Table, Button, InputNumber, Space, Divider, Typography,
    message, Modal, Card, Form, Input, Checkbox, Tabs, Radio
} from 'antd';
import {
    ShoppingCartOutlined, DeleteOutlined, ExclamationCircleOutlined,
    EditOutlined, PlusOutlined
} from '@ant-design/icons';
import { createOrder } from '@/apis/order';
import {
    getShippingAddresses,
    addShippingAddress,
    setDefaultAddress,
    getDefaultAddress
} from '@/apis/user';
import style from './CartTable.module.scss';
import moment from 'moment';
import DeliveryTimeSection from '@/components/DeliveryTimeSection';

const { Text, Title } = Typography;

const CartTable = () => {
    // 状态管理
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [addressForm] = Form.useForm();
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState(null);

    // 初始化数据
    useEffect(() => {
        fetchCart();
        fetchDefaultAddress();
    }, []);

    // 获取购物车数据
    const getCart = () => {
        try {
            return JSON.parse(sessionStorage.getItem('cart')) || [];
        } catch (error) {
            console.error('解析购物车数据失败:', error);
            return [];
        }
    };

    // 更新购物车数据
    const updateCart = (cart) => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        setCartItems([...cart]);
    };

    // 加载购物车数据
    const fetchCart = () => {
        setLoading(true);
        try {
            const cart = getCart();
            setCartItems(cart);
        } catch (error) {
            console.error('获取购物车数据失败', error);
            message.error('获取购物车数据失败');
        } finally {
            setLoading(false);
        }
    };

    // 获取默认地址
    const fetchDefaultAddress = async () => {
        try {
            const res = await getDefaultAddress();
            if (res.code === 200 && res.data) {
                setSelectedAddress(res.data);
                return res.data;
            }
            return null;
        } catch (error) {
            console.error('获取默认地址失败', error);
            return null;
        }
    };

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

    // 获取选中商品
    const getSelectedItems = () => {
        return cartItems.filter(item => selectedRowKeys.includes(item.flowerId));
    };

    // 计算选中商品的总价
    const calculateSelectedTotal = () => {
        return cartItems
            .filter(item => selectedRowKeys.includes(item.flowerId))
            .reduce((total, item) => {
                const price = item.discountPrice || item.originalPrice;
                return total + (price * item.quantity);
            }, 0);
    };

    // 计算所有商品的总价
    const calculateAllTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.discountPrice || item.originalPrice;
            return total + (price * item.quantity);
        }, 0);
    };

    // 处理结算
    const handleCheckout = () => {
        const selectedItems = getSelectedItems();
        if (selectedItems.length === 0) {
            message.warning('请选择要结算的商品');
            return;
        }

        if (!selectedAddress) {
            message.warning('请选择收货地址');
            return;
        }

        if (!deliveryTime) {
            message.warning('请选择送达时间');
            return;
        }

        Modal.confirm({
            title: '确认订单',
            icon: <ExclamationCircleOutlined />,
            width: 800,
            content: (
                <div>
                    <Card title="收货地址" style={{ marginBottom: 16 }}>
                        <div className={style.selectedAddress}>
                            <Text strong>{selectedAddress.receiverName}</Text>
                            <Text className={style.phone}>{selectedAddress.receiverPhone}</Text>
                            <div className={style.fullAddress}>
                                {selectedAddress.district} {selectedAddress.detailedAddress}
                                {selectedAddress.isDefault && (
                                    <Text type="success" className={style.defaultTag}>[默认]</Text>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card title="送达时间" style={{ marginBottom: 16 }}>
                        <Text strong>{deliveryTime.format('YYYY-MM-DD HH:mm')}</Text>
                    </Card>

                    <Card title="订单信息">
                        <ul className={style.orderItems}>
                            {selectedItems.map(item => (
                                <li key={item.flowerId} className={style.orderItem}>
                                    <Text>{item.name} × {item.quantity}</Text>
                                    <Text type="secondary" className={style.itemPrice}>
                                        ¥{(item.discountPrice || item.originalPrice) * item.quantity}
                                    </Text>
                                </li>
                            ))}
                        </ul>
                        <Divider className={style.orderDivider} />
                        <div className={style.orderTotal}>
                            <Text strong>总计: </Text>
                            <Text strong type="danger">¥{calculateSelectedTotal().toFixed(2)}</Text>
                        </div>
                    </Card>
                </div>
            ),
            okText: '确认支付',
            cancelText: '取消',
            onOk: async () => {
                try {
                    setConfirmLoading(true);
                    const orderData = {
                        items: selectedItems.map(item => ({
                            flowerId: item.flowerId,
                            quantity: item.quantity,
                            price: item.discountPrice || item.originalPrice
                        })),
                        addressId: selectedAddress.addressId,
                        deliveryTime: deliveryTime.format('YYYY-MM-DD HH:mm:ss'),
                        totalAmount: calculateSelectedTotal()
                    };

                    const response = await createOrder(orderData);

                    if (response.success) {
                        message.success('支付成功，订单已创建');
                        const cart = getCart();
                        const updatedCart = cart.filter(item => !selectedRowKeys.includes(item.flowerId));
                        updateCart(updatedCart);
                        setSelectedRowKeys([]);
                        setDeliveryTime(null);
                    } else {
                        message.error(response.message || '支付失败');
                    }
                } catch (error) {
                    console.error('支付失败:', error);
                    message.error('支付失败，请稍后重试');
                } finally {
                    setConfirmLoading(false);
                }
            }
        });
    };

    // 更新商品数量
    const handleQuantityChange = (flowerId, quantity) => {
        const cart = getCart();
        const index = cart.findIndex(item => item.flowerId === flowerId);

        if (index !== -1) {
            if (quantity > 0) {
                cart[index].quantity = quantity;
            } else {
                cart.splice(index, 1);
            }
            updateCart(cart);
        }
    };

    // 删除选中商品
    const handleDeleteSelected = () => {
        const cart = getCart();
        const updatedCart = cart.filter(item => !selectedRowKeys.includes(item.flowerId));
        updateCart(updatedCart);
        setSelectedRowKeys([]);
        message.success('已删除选中商品');
    };

    // 清空购物车
    const handleClearCart = () => {
        sessionStorage.removeItem('cart');
        setCartItems([]);
        setSelectedRowKeys([]);
        message.success('购物车已清空');
    };

    // 渲染地址选择区域
    const renderAddressSection = () => (
        <Card
            title="收货地址"
            className={style.addressCard}
            extra={
                <Button
                    type="link"
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
                            <Text type="success" className={style.defaultTag}>[默认]</Text>
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
                    <Text type="warning">请选择收货地址</Text>
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

    // 地址管理模态框内容
    const renderAddressManager = () => (
        <div className={style.addressManager}>
            <Tabs
                activeKey={isEditingAddress ? "add" : "select"}
                onChange={(key) => setIsEditingAddress(key === 'add')}
            >
                <Tabs.TabPane tab="选择地址" key="select">
                    {loadingAddresses ? (
                        <div style={{ textAlign: 'center', padding: '24px' }}>
                            <Text type="secondary">加载地址中...</Text>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className={style.emptyAddress}>
                            <Text type="secondary">暂无地址，请添加新地址</Text>
                            <Button
                                type="primary"
                                onClick={() => setIsEditingAddress(true)}
                                style={{ marginTop: 16 }}
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
                                                <Text type="success" className={style.defaultTag}>[默认]</Text>
                                            )}
                                        </div>
                                    </div>
                                    <Space>
                                        {!address.isDefault && (
                                            <Button
                                                type="text"
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
                    )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="新增地址" key="add">
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
                </Tabs.TabPane>
            </Tabs>
        </div>
    );

    // 表格列定义
    const columns = [
        {
            title: '商品图片',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 120,
            render: (text) => (
                <img
                    src={text || 'https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/flowers/1743422185863_780.jpg'}
                    alt="商品图片"
                    className={style.tableImage}
                />
            ),
        },
        {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <div>{text}</div>,
        },
        {
            title: '原价',
            dataIndex: 'originalPrice',
            key: 'originalPrice',
            render: (text) => <Text>¥{text.toFixed(2)}</Text>,
        },
        {
            title: '折后价',
            dataIndex: 'discountPrice',
            key: 'discountPrice',
            render: (text, record) => (
                text ? (
                    <Text type="danger">¥{text.toFixed(2)}</Text>
                ) : (
                    <Text>¥{record.originalPrice.toFixed(2)}</Text>
                )
            ),
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber
                    min={1}
                    max={99}
                    value={text}
                    onChange={(value) => handleQuantityChange(record.flowerId, value)}
                    className={style.quantityInput}
                />
            ),
        },
        {
            title: '小计',
            key: 'subtotal',
            render: (_, record) => {
                const price = record.discountPrice || record.originalPrice;
                return <Text strong>¥{(price * record.quantity).toFixed(2)}</Text>;
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleQuantityChange(record.flowerId, 0)}
                    className={style.deleteBtn}
                >
                    删除
                </Button>
            ),
        },
    ];

    // 表格底部内容
    const footer = () => (
        <div className={style.footerContainer}>
            <Space size="large">
                <Text strong>已选 {selectedRowKeys.length} 件商品</Text>
                <Text strong>合计: ¥{calculateSelectedTotal().toFixed(2)}</Text>
            </Space>
        </div>
    );

    return (
        <div className={style.container}>
            <div className={style.actionButtons}>
                <Space>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        disabled={selectedRowKeys.length === 0}
                        onClick={handleDeleteSelected}
                        className={style.actionBtn}
                    >
                        删除选中
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleClearCart}
                        disabled={cartItems.length === 0}
                        className={style.actionBtn}
                    >
                        清空购物车
                    </Button>
                </Space>
            </div>

            <div className={style.tableWrapper}>
                {selectedRowKeys.length > 0 && (
                    <>
                        {renderAddressSection()}
                        <DeliveryTimeSection
                            deliveryTime={deliveryTime}
                            setDeliveryTime={setDeliveryTime}
                        />
                    </>
                )}

                <Table
                    rowKey="flowerId"
                    columns={columns}
                    dataSource={cartItems}
                    loading={loading}
                    pagination={false}
                    footer={footer}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                    }}
                    scroll={{ x: true }}
                    className={style.cartTable}
                />
            </div>

            <Divider className={style.totalDivider} />

            <div className={style.totalSection}>
                <Text strong className={style.totalText}>
                    总计: <Text type="danger" className={style.totalPrice}>¥{calculateAllTotal().toFixed(2)}</Text>
                </Text>
                <Button
                    type="primary"
                    size="large"
                    className={style.checkoutButton}
                    icon={<ShoppingCartOutlined />}
                    onClick={handleCheckout}
                    disabled={selectedRowKeys.length === 0 || !selectedAddress || !deliveryTime}
                    loading={confirmLoading}
                >
                    去结算({selectedRowKeys.length})
                </Button>
            </div>

            {/* 地址管理模态框 */}
            <Modal
                title="管理收货地址"
                visible={addressModalVisible}
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
        </div>
    );
};

export default CartTable;