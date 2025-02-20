import React, { useState } from 'react';
import {
    HistoryOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
const items = [
    {
        key: 'home',
        label: '首页',
        icon: <HomeOutlined />,
    },
    {
        key: 'shopping',
        label: '购物车',
        icon:<ShoppingCartOutlined />
    },
    {
        key: 'orderDetails',
        label: '订单详情',
        icon:<HistoryOutlined />
    },
    {
        key:'user',
        label: '我的',
        icon:<UserOutlined />,
        children: [
            {
                key: 'personalData',
                label: '个人资料'
            },
            {
                key: 'modifyPwd',
                label: '修改密码'
            },
            {
                key: 'exit',
                label: '退出'
            },
        ],
    }
];
const TopBar = () => {
    const [current, setCurrent] = useState('home');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <div>
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10%' }}
            >
            </Menu>
        </div>
    );
};
export default TopBar;