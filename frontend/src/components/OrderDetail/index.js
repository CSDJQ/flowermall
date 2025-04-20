import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Typography,
    Button,
    Space,
    Divider,
    List,
    Tag,
    message,
    Timeline,
    Image
} from 'antd';
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    TruckOutlined
} from '@ant-design/icons';
import { getOrderDetail } from '@/apis/order';
import style from './OrderDetail.module.scss';

const { Title, Text } = Typography;

const OrderDetail = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [orderNumber]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const orderDetail = await getOrderDetail(orderNumber);
            if (orderDetail) {
                setOrder(orderDetail);
            } else {
                message.error('订单不存在');
                navigate('/orderList');
            }
        } catch (error) {
            console.error('获取订单详情失败:', error);
            message.error('获取订单详情失败');
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status) => {
        const config = {
            '制作中': { color: 'blue', icon: <SyncOutlined /> },
            '待配送': { color: 'orange', icon: <TruckOutlined /> },
            '已送达': { color: 'green', icon: <CheckCircleOutlined /> },
        }[status] || { color: 'default' };

        return <Tag color={config.color} icon={config.icon}>{status}</Tag>;
    };

    const renderTimeline = () => {
        const items = [
            {
                label: '订单创建',
                time: order.createdAt,
                color: 'green',
                dot: <CheckCircleOutlined />
            },
            {
                label: '支付完成',
                time: order.paymentTime,
                color: 'blue',
                dot: <CheckCircleOutlined />
            },
            {
                label: '开始制作',
                time: order.status === '制作中' ? new Date() : null,
                color: 'purple',
                dot: <SyncOutlined />
            },
            {
                label: '配送中',
                time: order.shippingTime,
                color: 'orange',
                dot: <TruckOutlined />
            },
            {
                label: '已完成',
                time: order.completedTime,
                color: 'red',
                dot: <CheckCircleOutlined />
            }
        ]
            .filter(item => item.time)
            .map(item => ({
                color: item.color,
                dot: item.dot,
                children: (
                    <>
                        <Text strong>{item.label}</Text>
                        <br />
                        <Text type="secondary">
                            {new Date(item.time).toLocaleString()}
                        </Text>
                    </>
                )
            }));

        return <Timeline mode="left" items={items} />;
    };

    if (!order) {
        return <div>加载中...</div>;
    }

    return (
        <div className={style.container}>
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className={style.backButton}
            >
                返回
            </Button>

            <Card loading={loading} className={style.orderCard}>
                <Title level={4} className={style.orderTitle}>
                    订单详情
                </Title>

                {/* 预计送达和状态 */}
                <div className={style.deliveryInfo}>
                    <Space size="large">
                        <div>
                            <Text type="secondary">预计送达</Text>
                            <div className={style.deliveryTime}>
                                <ClockCircleOutlined />
                                <Text strong>
                                    {order.deliveryTime ?
                                        new Date(order.deliveryTime).toLocaleString() :
                                        '待确认'}
                                </Text>
                            </div>
                        </div>
                        <div>
                            <Text type="secondary">订单状态</Text>
                            <div>{getStatusTag(order.status)}</div>
                        </div>
                    </Space>
                </div>

                <Divider orientation="left">商品清单</Divider>
                <List
                    itemLayout="horizontal"
                    dataSource={order.items}
                    renderItem={(item) => (
                        <List.Item className={style.orderItem}>
                            <List.Item.Meta
                                avatar={
                                    <Image
                                        width={80}
                                        height={80}
                                        src={item.imageUrl || 'https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/flowers/1743422185863_780.jpg'}
                                        alt={item.name}
                                        className={style.itemImage}
                                        fallback="https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/flowers/1743422185863_780.jpg"
                                    />
                                }
                                title={item.name}
                                description={
                                <Space direction="vertical">
                                    <Space>
                                        <Text>单价: </Text>
                                        {item.discountPrice ? (
                                            <>
                                                <Text delete>¥{item.unitPrice.toFixed(2)}</Text>
                                                <Text type="danger">
                                                    ¥{item.discountPrice.toFixed(2)}
                                                </Text>
                                            </>
                                        ) : (
                                            <Text>¥{item.unitPrice.toFixed(2)}</Text>
                                        )}
                                    </Space>
                                    <Text>数量: {item.quantity}</Text>
                                </Space>
                            }
                                />
                            <div className={style.itemRight}>
                                <Text strong className={style.subtotal}>
                                    ¥{item.subtotal.toFixed(2)}
                                </Text>
                            </div>
                        </List.Item>
                    )}
                />

                <Divider orientation="right">
                    <Space size="large">
                        <Text>商品总数: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</Text>
                        <Text strong>合计: ¥{order.totalAmount.toFixed(2)}</Text>
                    </Space>
                </Divider>

                <Divider orientation="left">收货信息</Divider>
                <Card variant={false} className={style.addressCard}>
                    <Text strong>{order.shippingAddress?.receiverName}</Text>
                    <Text className={style.phone}>{order.shippingAddress?.receiverPhone}</Text>
                    <div className={style.fullAddress}>
                        {order.shippingAddress?.district} {order.shippingAddress?.detailedAddress}
                    </div>
                </Card>

                <Divider orientation="left">物流信息</Divider>
                {renderTimeline()}
            </Card>
        </div>
    );
};

export default OrderDetail;