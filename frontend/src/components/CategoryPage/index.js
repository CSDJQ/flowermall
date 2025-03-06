import React, {useEffect, useState} from 'react';
import { Layout, Menu, Card, Row, Col } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import style from './CategoryPage.module.scss';
import {useParams} from "react-router-dom";

const { Sider, Content } = Layout;

// 示例数据
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
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    // 选择子项
    const handleItemClick = (item) => {
        setActiveItem(item.key);
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
    return (
        <div className={style.container}>
            <Layout style={{ minHeight: '100vh' }}>
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
                        <h2>商品查看</h2>
                        {activeItem ? (
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card
                                        title={activeItem}
                                        bordered={false}
                                        style={{ width: 300 }}
                                    >
                                        <p>这里是选中商品的详细描述...</p>
                                    </Card>
                                </Col>
                            </Row>
                        ) : (
                            <p>请选择一个商品。</p>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default CategoryPage;