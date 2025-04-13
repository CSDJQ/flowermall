import React, {useEffect, useState} from 'react';
import {
    EditOutlined,
    HistoryOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import {useNavigate, useLocation} from "react-router-dom"; // 添加 useLocation
import {useSelector} from "react-redux";
import { jwtDecode } from 'jwt-decode';

const baseItems = [
    {
        key: '',
        label: '首页',
        icon: <HomeOutlined />,
    },
    {
        key: 'shopping',
        label: '购物车',
        icon:<ShoppingCartOutlined />
    },
    {
        key: 'orderList',
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
    const location = useLocation(); // 获取当前路由信息
    const [current, setCurrent] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const token = useSelector((state) => state.cus.token);
    const role = token ? jwtDecode(token).isAdmin : false;

    // 根据路由初始化选中状态
    useEffect(() => {
        // 从路径中提取当前路由key (去掉开头的/)
        const pathKey = location.pathname.substring(1);
        // 检查是否是子菜单项
        const isSubItem = menuItems.some(item =>
            item.children?.some(child => child.key === pathKey)
        );

        // 如果是子菜单项，设置父菜单key为选中状态
        if(isSubItem) {
            const parentKey = menuItems.find(item =>
                item.children?.some(child => child.key === pathKey)
            )?.key;
            setCurrent(parentKey);
        } else {
            setCurrent(pathKey);
        }
    }, [location.pathname, menuItems]);

    // 根据 role 动态更新菜单项
    useEffect(() => {
        const updatedItems = [...baseItems];
        if (role) {
            updatedItems.splice(1, 0, {
                key: 'adminEdit',
                label: '编辑商品',
                icon: <EditOutlined />
            });
        }
        setMenuItems(updatedItems);
    }, [role]);

    const onClick =(e) => {
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
            />
        </div>
    );
};
export default TopBar;