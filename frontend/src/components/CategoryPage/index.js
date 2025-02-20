import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'antd';

const CategoryPage = () => {
    const { category } = useParams(); // 获取动态路由参数

    // 模拟商品数据
    const products = {
        '送恋人': [
            { id: 1, name: '玫瑰花束', price: '¥199', image: '/imgs/rose.jpg' },
            { id: 2, name: '满天星花束', price: '¥299', image: '/imgs/babysbreath.jpg' },
        ],
        '送长辈': [
            { id: 3, name: '康乃馨花篮', price: '¥399', image: '/imgs/carnation.jpg' },
            { id: 4, name: '百合花束', price: '¥499', image: '/imgs/lily.jpg' },
        ],
        // 其他分类数据...
    };

    return (
        <div>
            <h1>{category} 商品列表</h1>
            <Row gutter={[16, 16]}>
                {products[category].map((product) => (
                    <Col key={product.id} span={6}>
                        <Card
                            cover={<img alt={product.name} src={product.image} />}
                        >
                            <Card.Meta
                                title={product.name}
                                description={product.price}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default CategoryPage;