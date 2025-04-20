import React from 'react';
import { Card } from 'antd';
import style from './Main.module.scss';
import { useNavigate } from "react-router-dom";
import { SmileOutlined } from "@ant-design/icons";

const guideContents = [
    {
        key: 'purpose',
        icon: <SmileOutlined />,
        label: '用途',
        children: ['爱情鲜花', '友情鲜花', '生日鲜花', '长辈亲戚', '师恩难忘', '祝贺鲜花', '哀思鲜花', '商务桌花', '开业花篮'],
    },
    {
        key: 'mainFlower',
        icon: <SmileOutlined />,
        label: '主花',
        children: ['红玫瑰', '粉玫瑰', '白玫瑰', '香槟玫瑰', '康乃馨', '百合', '向日葵', '绣球花', '其他'],
    },
    {
        key: 'colorScheme',
        icon: <SmileOutlined />,
        label: '色系',
        children: ['红色', '粉色', '香槟', '黄色', '白色', '紫色', '蓝色', '绿色', '其他色系'],
    },
    {
        key: 'stemCount',
        icon: <SmileOutlined />,
        label: '支数',
        children: ['6枝', '9枝', '11枝', '19枝', '33枝', '52枝', '66枝', '99枝', '199枝'],
    },
];

const Main = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (parentKey, childKey) => {
        navigate('/category', { state: { parentKey, childKey } });
    };

    return (
        <div className={style.container}>
            {/* 分类导购卡片 */}
            <Card
                className={style.guideCard}
                title="分类导购"
            >
                {guideContents.map((item) => (
                    <div key={item.key} className={style.categoryGroup}>
                        <h4>{item.label}</h4>
                        <div className={style.categoryItems}>
                            {item.children.map((child) => (
                                <div
                                    key={child}
                                    className={style.categoryItem}
                                    onClick={() => handleCategoryClick(item.key, child)}
                                >
                                    {child}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Card>

            {/* 右侧卡片区域 */}
            <div className={style.rightCards}>
                {/* 上排两个卡片 */}
                <div className={style.topRow}>
                    <Card
                        className={style.card2}
                        style={{ backgroundImage: "url('https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/background/lianren.png')" }}
                        onClick={() => handleCategoryClick('purpose', '爱情鲜花')}
                    >
                    </Card>
                    <Card
                        className={style.card2}
                        style={{ backgroundImage: "url('https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/background/zhangbei.png')" }}
                        onClick={() => handleCategoryClick('purpose', '长辈亲戚')}
                    >
                    </Card>
                </div>

                {/* 中间大卡片 */}
                <div className={style.middleRow}>
                    <Card
                        className={style.card3}
                        style={{ backgroundImage: "url('https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/background/xiaozhushou.png')"}}
                        onClick={() => navigate('/chat')}
                    >
                    </Card>
                </div>

                {/* 下排四个小卡片 */}
                <div className={style.bottomRow}>
                    <Card
                        className={style.card5}
                        style={{ backgroundImage: "url('https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/background/biaobaiqiuhun.png')" }}
                        onClick={() => handleCategoryClick('purpose', '爱情鲜花')}
                    >
                    </Card>
                    <Card
                        className={style.card5}
                        style={{ backgroundImage: "url('https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/background/shengrijingxi.png')" }}
                        onClick={() => handleCategoryClick('purpose', '生日鲜花')}
                    >
                    </Card>
                    <Card
                        className={style.card5}
                        style={{ backgroundImage: "url('https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/background/youqingjianzheng.png')" }}
                        onClick={() => handleCategoryClick('purpose', '友情鲜花')}
                    >
                    </Card>
                    <Card
                        className={style.card5}
                        style={{ backgroundImage: "url('https://flower-1346990013.cos.ap-guangzhou.myqcloud.com/background/kaiyedaji.png')" }}
                        onClick={() => handleCategoryClick('purpose', '开业花篮')}
                    >
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Main;