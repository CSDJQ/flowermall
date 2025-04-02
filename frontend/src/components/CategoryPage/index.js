import React, {useEffect, useState} from 'react';
import {Layout, Menu, Card, Row, Col, Button, Image, Tooltip, InputNumber} from 'antd';
import { SmileOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import style from './CategoryPage.module.scss';
import {useLocation} from "react-router-dom";
import {getFlowersByCategory} from "../../apis/flower";

const { Sider, Content } = Layout;

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

// 获取菜单项的层级关系
const getLevelKeys = (items) => {
    const key = {};
    const func = (items, level = 1) => {
        items.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items);
    return key;
};

const levelKeys = getLevelKeys(guideContents);

const CategoryPage = () => {
    const location = useLocation();
    const { state } = location;
    const { parentKey, childKey } = state || {};

    const [activeItem, setActiveItem] = useState(null);
    const [stateOpenKeys, setStateOpenKeys] = useState([parentKey]);
    const [flowerList, setFlowerList] = useState([]);

    // 监听路由参数变化，更新状态
    useEffect(() => {
        if (parentKey) {
            setStateOpenKeys([parentKey]);
        }
        if (childKey) {
            handleItemClick({key: childKey});
        }
    }, [parentKey,childKey]);

    // 处理菜单展开/收起
    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys
                    .filter((_, index) => index !== repeatIndex)
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    // 选择子项
    const handleItemClick = async (item) => {
        setActiveItem(item.key);
        const type = stateOpenKeys[0];
        const value = item.key;
        const response = await getFlowersByCategory(type,value);
        setFlowerList(response.data);
    };

    // 获取当前购物车数据
    const getCart = () => {
        return JSON.parse(sessionStorage.getItem('cart')) || [];
    };

    // 添加到购物车
    const addToCart = (flower) => {
        const cart = getCart();
        const existingItem = cart.find(item => item.flowerId === flower.flowerId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...flower,
                quantity: 1
            });
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        setFlowerList([...flowerList]); // 触发重新渲染
    };

    // 从购物车移除
    const removeFromCart = (flower) => {
        const cart = getCart();
        const index = cart.findIndex(item => item.flowerId === flower.flowerId);

        if (index !== -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            sessionStorage.setItem('cart', JSON.stringify(cart));
            setFlowerList([...flowerList]); // 触发重新渲染
        }
    };

    // 获取商品在购物车中的数量
    const getQuantityInCart = (flowerId) => {
        const cart = getCart();
        const item = cart.find(item => item.flowerId === flowerId);
        return item ? item.quantity : 0;
    };

    // 渲染购物车操作区域
    const renderCartActions = (flower) => {
        const quantity = getQuantityInCart(flower.flowerId);

        if (quantity > 0) {
            return [
                <Button
                    key="minus"
                    icon={<MinusOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(flower);
                    }}
                />,
                <InputNumber
                    key="quantity"
                    min={1}
                    max={99}
                    value={quantity}
                    style={{ width: 60 }}
                    readOnly
                />,
                <Button
                    key="plus"
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(flower);
                    }}
                />
            ];
        } else {
            return [
                <Button
                    key="add"
                    type="primary"
                    size="large"
                    shape="circle"
                    icon={<ShoppingCartOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(flower);
                    }}
                >
                </Button>
            ];
        }
    };

    return (
        <div className={style.container}>
            <Layout style={{ minHeight: '100vh' }}>
                {/* 侧边栏保持不变 */}
                <Sider width={240} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[childKey]}
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        style={{ height: '100%', borderRight: 0 }}
                        items={guideContents}
                        onClick={({ key }) => handleItemClick({ key })}
                    />
                </Sider>

                {/* 主要内容区域 */}
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: '#fff',
                        }}
                    >
                        <h2>{activeItem}</h2>
                        {flowerList.length > 0 ? (
                            <Row gutter={16}>
                                {flowerList.map((flower) => (
                                    <Col key={flower.flowerId} span={8} style={{ marginBottom: 16 }}>
                                        <Card
                                            className={style.flowerCard}
                                            hoverable
                                            cover={
                                                <Image
                                                    alt={flower.name}
                                                    src={flower.imageUrl || 'https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/flowers/1743422185863_780.jpg'}
                                                    className={style.flowerImage}
                                                />
                                            }
                                            actions={renderCartActions(flower)}
                                        >
                                            <div className={style.flowerInfo}>
                                                <div className={style.titleRow}>
                                                    <h3>{flower.name}</h3>
                                                </div>
                                                <div className={style.priceRow}>
                                                    <div className={style.price}>
                                                        {flower.discountPrice ? (
                                                            <>
                                                                <span className={style.discountPrice}>¥{flower.discountPrice}</span>
                                                                <span className={style.originalPrice}>¥{flower.originalPrice}</span>
                                                            </>
                                                        ) : (
                                                            <span>¥{flower.originalPrice}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <Tooltip title={flower.description}>
                                                    <p className={style.description}>
                                                        {flower.description.length > 30
                                                            ? `${flower.description.substring(0, 30)}...`
                                                            : flower.description}
                                                    </p>
                                                </Tooltip>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <p>请选择一个类别</p>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default CategoryPage;