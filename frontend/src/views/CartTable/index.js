import React, { useState, useEffect } from 'react';
import {
    Table, Button, InputNumber, Space, Divider, Typography,
    message, Modal, Card
} from 'antd';
import {
    ShoppingCartOutlined, DeleteOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { createOrder } from '@/apis/order';
import { getDefaultAddress } from '@/apis/user';
import style from './CartTable.module.scss';
import DeliveryTimeSection from '@/components/DeliveryTimeSection';
import AddressSelector from '@/components/AddressSelector';

const { Text } = Typography;

const CartTable = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState(null);

    useEffect(() => {
        fetchCart();
        fetchDefaultAddress();
    }, []);

    const getCart = () => {
        try {
            return JSON.parse(sessionStorage.getItem('cart')) || [];
        } catch (error) {
            console.error('解析购物车数据失败:', error);
            return [];
        }
    };

    const updateCart = (cart) => {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        setCartItems([...cart]);
    };

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

    const getSelectedItems = () => {
        return cartItems.filter(item => selectedRowKeys.includes(item.flowerId));
    };

    const calculateSelectedTotal = () => {
        return cartItems
            .filter(item => selectedRowKeys.includes(item.flowerId))
            .reduce((total, item) => {
                const price = item.discountPrice || item.originalPrice;
                return total + (price * item.quantity);
            }, 0);
    };

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
                            unitPrice: item.originalPrice,
                            discountPrice: item.discountPrice
                        })),
                        addressId: selectedAddress.addressId,
                        deliveryTime: deliveryTime.toISOString(),
                        paymentMethod: '在线支付',
                        remark: '请尽快配送'
                    };

                    const response = await createOrder(orderData);

                    if (response.success) {
                        message.success('订单创建成功');
                        const cart = getCart();
                        const updatedCart = cart.filter(item => !selectedRowKeys.includes(item.flowerId));
                        updateCart(updatedCart);
                        setSelectedRowKeys([]);
                        setDeliveryTime(null);
                    } else {
                        message.error(response.message || '订单创建失败');
                    }
                } catch (error) {
                    console.error('订单创建失败:', error);
                    message.error('订单创建失败，请稍后重试');
                } finally {
                    setConfirmLoading(false);
                }
            }
        });
    };

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

    const handleDeleteSelected = () => {
        const cart = getCart();
        const updatedCart = cart.filter(item => !selectedRowKeys.includes(item.flowerId));
        updateCart(updatedCart);
        setSelectedRowKeys([]);
        message.success('已删除选中商品');
    };

    const handleClearCart = () => {
        sessionStorage.removeItem('cart');
        setCartItems([]);
        setSelectedRowKeys([]);
        message.success('购物车已清空');
    };

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
                        <AddressSelector
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                            fetchDefaultAddress={fetchDefaultAddress}
                        />
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
                    总计: <Text type="danger" className={style.totalPrice}>¥{calculateSelectedTotal().toFixed(2)}</Text>
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
        </div>
    );
};

export default CartTable;