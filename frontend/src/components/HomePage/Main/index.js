import React from 'react';
import { Card } from 'antd';
import style from './Main.module.scss';
import {useNavigate} from "react-router-dom";
import {SmileOutlined} from "@ant-design/icons";

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

const Main = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (parentKey, childKey) => {
        console.log(`Parent Key: ${parentKey}, Child Key: ${childKey}`);
        navigate(`/home/category/${parentKey}/${childKey}`); // 跳转到分类页面
    };

    return (
        <>
            <Card
                className={style.guide}
                title="分类导购"
                bordered={false}
            >
                {guideContents.map((item, index) => (
                    <div key={index}>
                        <h4>{item.label}</h4>
                        <div className={style.columns}> {/* 添加两列布局的类 */}
                            {item.children.map((child, childIndex) => (
                                <p key={childIndex} onClick={() => handleCategoryClick(item.key,child.label)}>
                                    {child.label}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </Card>

            <div className={style.exguide}>
                <div className={style.exguideTop}>
                    <Card
                        className={style.card1}
                        title="特惠专区"
                        bordered={false}
                    >
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>

                    <Card
                        className={style.card1}
                        title="热销榜单"
                        bordered={false}
                    >
                        <p>Card content</p>
                        <p>Card content</p>
                        <p>Card content</p>
                    </Card>
                </div>
                <div className={style.exguideBottom}>
                   <div className={style.exguideBottomLeft}>
                       <Card
                           className={style.card2}
                           bordered={false}
                       >
                           送恋人
                       </Card>

                       <Card
                           className={style.card2}
                           bordered={false}
                       >
                           送长辈
                       </Card>
                   </div>
                    <div className={style.exguideBottomMiddle}>
                        <Card
                            className={style.card3}
                            bordered={false}
                        >
                          专属设计
                        </Card>
                    </div>
                    <div className={style.exguideBottomRight}>
                        <Card
                            className={style.card5}
                            bordered={false}
                        >
                            表白求婚
                        </Card>

                        <Card
                            className={style.card5}
                            bordered={false}
                        >
                            开业商务
                        </Card>
                        <Card
                            className={style.card5}
                            bordered={false}
                        >
                            后备箱
                        </Card>
                        <Card
                            className={style.card5}
                            bordered={false}
                        >
                            后备箱
                        </Card>
                    </div>
                </div>
            </div>


        </>
    );
}

export default Main;