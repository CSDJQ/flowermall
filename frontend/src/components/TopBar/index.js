import React, {useEffect, useState} from 'react';
import {
    EditOutlined,
    HistoryOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import { jwtDecode } from 'jwt-decode';
const baseItems = [
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
    const navigate = useNavigate();
    const [current, setCurrent] = useState('home');
    const [menuItems, setMenuItems] = useState([]);
    const token = useSelector((state) => state.cus.token);
    const role = token ? jwtDecode(token).isAdmin : false;
    // 根据 role 动态更新菜单项
    useEffect(() => {
        const updatedItems = [...baseItems]; // 复制初始菜单项
        if (role) {
            updatedItems.splice(1, 0, { // 插入“编辑商品”菜单项
                key: 'adminEdit',
                label: '编辑商品',
                icon: <EditOutlined />
            });
        }
        setMenuItems(updatedItems); // 更新菜单项状态
    }, [role]);

    const onClick = (e) => {
        console.log('click ', e);
        // 如果点击的是“首页”，刷新页面
        navigate(`/${e.key}`);
        setCurrent(e.key);
    };

    return (
        <div>
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={menuItems}
                style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10%' }}
            >
            </Menu>
        </div>
    );
};
export default TopBar;