import React from 'react';
import { Card } from 'antd';
import style from './Main.module.scss';
import {useNavigate} from "react-router-dom";

const guideContents = [
    {
        className:'用途',
        contents: [
            {value: '送恋人' },
            {value: '送长辈' },
            {value: '开业大吉' },
        ]
    },
    {
        className:'主花',
        contents: [
            {value: '向日葵' },
            {value: '玫瑰' },
            {value: '绣球' },
            {value: '其他' },
        ]
    },
]

const Main = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/category/${category}`); // 跳转到分类页面
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
                        <h4>{item.className}</h4>
                        <div className={style.columns}> {/* 添加两列布局的类 */}
                            {item.contents.map((content, contentIndex) => (
                                <p key={contentIndex} onClick={() => handleCategoryClick(content.value)}>
                                    {content.value}
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