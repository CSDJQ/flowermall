import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Select, Space, Image, Tag, Row, Col, Modal } from 'antd';
import {
    HistoryOutlined,
    RightOutlined,
    FilterOutlined,
    TagOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    TruckOutlined,
    CarOutlined
} from '@ant-design/icons';
import { getOrders, updateOrderStatus } from '@/apis/order';
import { useNavigate } from 'react-router-dom';
import store from '@/store';
import { jwtDecode } from 'jwt-decode';
import style from './OrderList.module.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: '制作中', label: '制作中' },
    { value: '待配送', label: '待配送' },
    { value: '已送达', label: '已送达' },
];

// 状态转换关系
const statusTransitions = {
    '制作中': ['待配送'],
    '待配送': ['配送中'],
    '配送中': ['已送达'],
    '已送达': []
};

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortConfig, setSortConfig] = useState({
        field: 'created_at',
        order: 'asc' // 默认升序
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // 检查是否是管理员
    useEffect(() => {
        const token = store.getState().cus.token;
        if (token) {
            const decoded = jwtDecode(token);
            setIsAdmin(decoded.isAdmin || false);
        }
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const result = await getOrders({
                status: filterStatus !== 'all' ? filterStatus : undefined,
                sortField: sortConfig.field,
                sortOrder: sortConfig.order
            });
            setOrders(result.list || []);
        } catch (error) {
            console.error('获取订单列表失败:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filterStatus, sortConfig]);

    const handleSortClick = (field) => {
        setSortConfig(prev => {
            // 如果点击的是当前排序字段，则切换顺序
            if (prev.field === field) {
                return {
                    field,
                    order: prev.order === 'asc' ? 'desc' : 'asc'
                };
            }
            // 如果点击的是新字段，则使用新字段并重置为升序
            return {
                field,
                order: 'asc'
            };
        });
    };

    // 处理状态更新
    const handleStatusUpdate = async (orderNumber, currentStatus) => {
        const nextStatusOptions = statusTransitions[currentStatus] || [];

        if (nextStatusOptions.length === 0) {
            Modal.info({
                title: '提示',
                content: '此订单状态已无法继续变更',
            });
            return;
        }

        Modal.confirm({
            title: '确认修改状态',
            content: `确定要将订单 ${orderNumber} 状态修改为 "${nextStatusOptions[0]}" 吗?`,
            onOk: async () => {
                try {
                    await updateOrderStatus(orderNumber, nextStatusOptions[0]);
                    fetchOrders(); // 刷新订单列表
                } catch (error) {
                    console.error('状态更新失败:', error);
                }
            }
        });
    };

    const renderStatusTag = (status, order) => {
        const config = {
            '制作中': { color: 'blue', icon: <SyncOutlined /> },
            '待配送': { color: 'orange', icon: <TruckOutlined /> },
            '配送中': { color: 'magenta', icon:<CarOutlined />  },
            '已送达': { color: 'green', icon: <CheckCircleOutlined /> },
        }[status] || { color: 'default' };

        return (
            <Tag
                color={config.color}
                icon={config.icon}
                onClick={isAdmin ? () => handleStatusUpdate(order.orderNumber, status) : null}
                style={isAdmin ? { cursor: 'pointer' } : {}}
            >
                {status}
            </Tag>
        );
    };

    const renderSortIndicator = (field) => {
        if (sortConfig.field !== field) return null;
        return sortConfig.order === 'asc' ?
            <SortAscendingOutlined style={{ marginLeft: 4 }} /> :
            <SortDescendingOutlined style={{ marginLeft: 4 }} />;
    };

    const renderOrderCard = (order) => {
        const previewImages = order.items?.slice(0, 3).map(item =>
            item.imageUrl || 'https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/flowers/1743422185863_780.jpg'
        ) || [];

        const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        return (
            <Card
                key={order.orderNumber}
                className={style.orderCard}
                loading={loading}
            >
                <div className={style.cardHeader}>
                    <div className={style.deliveryTimeBadge}>
                        <ClockCircleOutlined />
                        {formatTime(order.deliveryTime)}
                    </div>
                    <div className={style.statusWrapper}>
                        {renderStatusTag(order.status, order)}
                    </div>
                </div>

                <div className={style.cardContent}>
                    <div className={style.contentLeft}>
                        <Space size="middle" className={style.imageGroup}>
                            {previewImages.map((image, index) => (
                                <Image
                                    key={index}
                                    width={80}
                                    height={80}
                                    src={image}
                                    alt="商品图片"
                                    preview={false}
                                    fallback="https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/flowers/1743422185863_780.jpg"
                                />
                            ))}
                        </Space>

                        <div className={style.orderInfo}>
                            <Text type="secondary" className={style.orderText}>
                                订单号: {order.orderNumber}
                            </Text>
                            <Text type="secondary" className={style.orderText}>
                                下单时间: {formatTime(order.createdAt)}
                            </Text>
                        </div>
                    </div>

                    <div className={style.contentRight}>
                        <div className={style.orderSummary}>
                            <Text strong>¥{order.totalAmount.toFixed(2)}</Text>
                            <Text type="secondary">共{totalItems}件</Text>
                        </div>
                    </div>
                </div>

                <div className={style.cardFooter}>
                    <Button
                        type="text"
                        size="small"
                        icon={<RightOutlined />}
                        onClick={() => navigate(`/orderDetails/${order.orderNumber}`)}
                    >
                        查看更多
                    </Button>
                </div>
            </Card>
        );
    };

    return (
        <div className={style.container}>
            <div className={style.header}>
                <Title level={4} className={style.title}>
                    <HistoryOutlined /> 订单列表
                </Title>
                <Space>
                    <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 120 }}
                        placeholder="筛选状态"
                        optionLabelProp="label"
                    >
                        {statusOptions.map(opt => (
                            <Option key={opt.value} value={opt.value} label={opt.label}>
                                <Space>
                                    {opt.value === 'all' ? <FilterOutlined /> : <TagOutlined />}
                                    {opt.label}
                                </Space>
                            </Option>
                        ))}
                    </Select>

                    <Space className={style.sortOptions}>
                        <Text
                            className={style.sortOption}
                            onClick={() => handleSortClick('created_at')}
                            style={{
                                color: sortConfig.field === 'created_at' ? '#1890ff' : 'inherit',
                                fontWeight: sortConfig.field === 'created_at' ? 500 : 'normal'
                            }}
                        >
                            下单时间
                            {renderSortIndicator('created_at')}
                        </Text>
                        <Text
                            className={style.sortOption}
                            onClick={() => handleSortClick('delivery_time')}
                            style={{
                                color: sortConfig.field === 'delivery_time' ? '#1890ff' : 'inherit',
                                fontWeight: sortConfig.field === 'delivery_time' ? 500 : 'normal'
                            }}
                        >
                            预计送达
                            {renderSortIndicator('delivery_time')}
                        </Text>
                    </Space>
                </Space>
            </div>

            <Row gutter={[16, 16]} className={style.orderGrid}>
                {orders.map(order => (
                    <Col key={order.orderNumber} xs={24} sm={12} md={12} lg={12} xl={12}>
                        {renderOrderCard(order)}
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default OrderList;