import React, {useEffect, useState} from 'react';
import {Layout, Menu, Card, Row, Col, Button, Image} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import style from './CategoryPage.module.scss';
import {useParams} from "react-router-dom";
import {request} from "@/utils"
import {addFlower, getFlowersByCategory} from "../../apis/flower";

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
            { key: '香槟玫瑰', label: '香槟玫瑰' },
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
    const [activeItem, setActiveItem] = useState(null);
    const [stateOpenKeys, setStateOpenKeys] = useState(['1']);
    const [flowerList, setFlowerList] = useState([]); // 存储商品列表

    // 处理菜单展开/收起
    const onOpenChange = (openKeys) => {
        console.log(openKeys);
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
        console.log(stateOpenKeys);
        const type = stateOpenKeys[0];
        const value = item.key;
        const response = await getFlowersByCategory(type,value);
        console.log(response.data); // 打印分组后的商品数据
        setFlowerList(response.data);
        // 后端请求按照本分类方式分的列表，前端进行切片
        // console.log(response);
    };
    const { parentKey,childKey } = useParams();
    // 监听路由参数变化，更新状态
    useEffect(() => {
        if (parentKey) {
            onOpenChange([...stateOpenKeys,parentKey]);
        }
        if (childKey) {
            handleItemClick({key: childKey});
        }
    }, [parentKey, childKey]);

    // 批量添加商品
    const handle = async () => {
        const flowers = [
            {
                "name": "阳光玫瑰",
                "description": "红色玫瑰",
                "originalPrice": 100.0,
                "discountPrice": 80.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "红玫瑰",
                "purpose": "爱情鲜花",
                "colorScheme": "红色",
                "stemCount": 12
            },
            {
                "name": "白玫瑰",
                "description": "白色玫瑰",
                "originalPrice": 120.0,
                "discountPrice": null,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "白玫瑰",
                "purpose": "友情鲜花",
                "colorScheme": "白色",
                "stemCount": 6
            },
            {
                "name": "香槟玫瑰",
                "description": "香槟色玫瑰",
                "originalPrice": 150.0,
                "discountPrice": 130.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "香槟玫瑰",
                "purpose": "爱情鲜花",
                "colorScheme": "香槟",
                "stemCount": 11
            },
            {
                "name": "康乃馨",
                "description": "粉色康乃馨",
                "originalPrice": 80.0,
                "discountPrice": 70.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "康乃馨",
                "purpose": "长辈亲戚",
                "colorScheme": "粉色",
                "stemCount": 9
            },
            {
                "name": "百合",
                "description": "白色百合",
                "originalPrice": 90.0,
                "discountPrice": null,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "百合",
                "purpose": "师恩难忘",
                "colorScheme": "白色",
                "stemCount": 19
            },
            {
                "name": "向日葵",
                "description": "黄色向日葵",
                "originalPrice": 70.0,
                "discountPrice": 60.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "向日葵",
                "purpose": "祝贺鲜花",
                "colorScheme": "黄色",
                "stemCount": 33
            },
            {
                "name": "绣球花",
                "description": "蓝色绣球花",
                "originalPrice": 110.0,
                "discountPrice": 100.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "绣球花",
                "purpose": "商务桌花",
                "colorScheme": "蓝色",
                "stemCount": 52
            },
            {
                "name": "红玫瑰",
                "description": "经典红玫瑰",
                "originalPrice": 100.0,
                "discountPrice": 90.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "红玫瑰",
                "purpose": "爱情鲜花",
                "colorScheme": "红色",
                "stemCount": 66
            },
            {
                "name": "粉玫瑰",
                "description": "粉色玫瑰",
                "originalPrice": 110.0,
                "discountPrice": null,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "粉玫瑰",
                "purpose": "友情鲜花",
                "colorScheme": "粉色",
                "stemCount": 99
            },
            {
                "name": "紫玫瑰",
                "description": "紫色玫瑰",
                "originalPrice": 130.0,
                "discountPrice": 120.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "紫玫瑰",
                "purpose": "哀思鲜花",
                "colorScheme": "紫色",
                "stemCount": 199
            },
            {
                "name": "绿玫瑰",
                "description": "绿色玫瑰",
                "originalPrice": 140.0,
                "discountPrice": 130.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "其他",
                "purpose": "商务桌花",
                "colorScheme": "绿色",
                "stemCount": 6
            },
            {
                "name": "蓝玫瑰",
                "description": "蓝色玫瑰",
                "originalPrice": 150.0,
                "discountPrice": 140.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "其他",
                "purpose": "爱情鲜花",
                "colorScheme": "蓝色",
                "stemCount": 11
            },
            {
                "name": "黄玫瑰",
                "description": "黄色玫瑰",
                "originalPrice": 120.0,
                "discountPrice": 110.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "其他",
                "purpose": "友情鲜花",
                "colorScheme": "黄色",
                "stemCount": 19
            },
            {
                "name": "红康乃馨",
                "description": "红色康乃馨",
                "originalPrice": 85.0,
                "discountPrice": 75.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "康乃馨",
                "purpose": "长辈亲戚",
                "colorScheme": "红色",
                "stemCount": 9
            },
            {
                "name": "粉康乃馨",
                "description": "粉色康乃馨",
                "originalPrice": 90.0,
                "discountPrice": 80.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "康乃馨",
                "purpose": "长辈亲戚",
                "colorScheme": "粉色",
                "stemCount": 11
            },
            {
                "name": "白康乃馨",
                "description": "白色康乃馨",
                "originalPrice": 95.0,
                "discountPrice": 85.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "康乃馨",
                "purpose": "长辈亲戚",
                "colorScheme": "白色",
                "stemCount": 19
            },
            {
                "name": "紫百合",
                "description": "紫色百合",
                "originalPrice": 100.0,
                "discountPrice": 90.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "百合",
                "purpose": "师恩难忘",
                "colorScheme": "紫色",
                "stemCount": 33
            },
            {
                "name": "黄百合",
                "description": "黄色百合",
                "originalPrice": 110.0,
                "discountPrice": 100.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "百合",
                "purpose": "祝贺鲜花",
                "colorScheme": "黄色",
                "stemCount": 52
            },
            {
                "name": "粉百合",
                "description": "粉色百合",
                "originalPrice": 120.0,
                "discountPrice": 110.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "百合",
                "purpose": "友情鲜花",
                "colorScheme": "粉色",
                "stemCount": 66
            },
            {
                "name": "红绣球花",
                "description": "红色绣球花",
                "originalPrice": 130.0,
                "discountPrice": 120.0,
                "isOnSale": true,
                "imageUrl": null,
                "mainFlower": "绣球花",
                "purpose": "商务桌花",
                "colorScheme": "红色",
                "stemCount": 99
            }
        ];

        for (const flower of flowers) {
            try {
                const response = await addFlower(flower);
                console.log('添加成功:', response.data);
            } catch (error) {
                console.error('添加失败:', error);
            }
        }
    };

    return (
        <div className={style.container}>
            <Layout style={{ minHeight: '100vh' }}>
                <Button onClick={handle}>批量添加商品</Button>
                {/* 侧边栏 */}
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
                                                    src={flower.imageUrl || 'https://via.placeholder.com/150'}
                                                    className={style.flowerImage}
                                                />
                                            }
                                        >
                                            <div className={style.flowerInfo}>
                                                <h3>{flower.name}</h3>
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
                                                <p className={style.description}>{flower.description}</p>
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