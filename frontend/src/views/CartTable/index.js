import React, { useState, useEffect } from 'react';
import { Table, Button, InputNumber, Space, Divider, Typography, message, Modal } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { createOrder } from '@/apis/order'; // 假设有创建订单的API
import style from './CartTable.module.scss';

const { Text } = Typography;
const { confirm } = Modal;

const CartTable = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    // 获取购物车数据（从sessionStorage）
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
            message.success('购物车已更新');
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

    // 获取选中商品
    const getSelectedItems = () => {
        return cartItems.filter(item => selectedRowKeys.includes(item.flowerId));
    };

    // 处理结算
    const handleCheckout = () => {
        const selectedItems = getSelectedItems();
        if (selectedItems.length === 0) {
            message.warning('请选择要结算的商品');
            return;
        }

        confirm({
            title: '确认支付',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>确认支付以下商品吗？</p>
                    <ul style={{ marginTop: 8 }}>
                        {selectedItems.map(item => (
                            <li key={item.flowerId}>
                                {item.name} × {item.quantity}
                                <Text type="secondary" style={{ marginLeft: 8 }}>
                                    ¥{(item.discountPrice || item.originalPrice) * item.quantity}
                                </Text>
                            </li>
                        ))}
                    </ul>
                    <Divider style={{ margin: '12px 0' }} />
                    <Text strong>总计: ¥{calculateSelectedTotal().toFixed(2)}</Text>
                </div>
            ),
            okText: '确认支付',
            cancelText: '取消',
            onOk: async () => {
                try {
                    setConfirmLoading(true);
                    // 调用创建订单API
                    const orderData = {
                        items: selectedItems.map(item => ({
                            flowerId: item.flowerId,
                            quantity: item.quantity,
                            price: item.discountPrice || item.originalPrice
                        })),
                        totalAmount: calculateSelectedTotal()
                    };

                    const response = await createOrder(orderData);

                    if (response.success) {
                        message.success('支付成功，订单已创建');

                        // 从购物车中移除已支付的商品
                        const cart = getCart();
                        const updatedCart = cart.filter(item => !selectedRowKeys.includes(item.flowerId));
                        updateCart(updatedCart);
                        setSelectedRowKeys([]);
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
            render: (text, record) => (
                <div>
                    <div>{text}</div>
                    <Text type="secondary">{record.description?.substring(0, 30)}...</Text>
                </div>
            ),
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
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleQuantityChange(record.flowerId, 0)}
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

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <div className={style.container}>
            <div className={style.actionButtons}>
                <Space>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        disabled={selectedRowKeys.length === 0}
                        onClick={handleDeleteSelected}
                    >
                        删除选中
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleClearCart}
                        disabled={cartItems.length === 0}
                    >
                        清空购物车
                    </Button>
                </Space>
            </div>

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

            <Divider />

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
                    disabled={selectedRowKeys.length === 0}
                    loading={confirmLoading}
                >
                    去结算({selectedRowKeys.length})
                </Button>
            </div>
        </div>
    );
};

export default CartTable;