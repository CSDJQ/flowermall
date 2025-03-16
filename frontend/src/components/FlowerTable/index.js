import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Input, Space } from 'antd';
import { getFlowers, deleteFlower, updateFlower, getCategory, updateCategory } from '@/apis/flower';
import FlowerForm from '@/components/FlowerForm';
import CategoryForm from '@/components/CategoryForm';

const FlowerTable = ({ onSubmit }) => {
    const [flowers, setFlowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isFlowerModalVisible, setIsFlowerModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [currentFlower, setCurrentFlower] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);

    // 获取鲜花数据
    const fetchFlowers = async () => {
        setLoading(true);
        try {
            const response = await getFlowers();
            setFlowers(response);
        } catch (error) {
            message.error('获取鲜花数据失败');
        } finally {
            setLoading(false);
        }
    };

    // 删除鲜花
    const handleDelete = async (flowerId) => {
        try {
            const res = await deleteFlower(flowerId);
            if(res) {
                message.success('删除成功');
                fetchFlowers();
            }
            else message.error('删除失败');
        } catch (error) {
            message.error('删除失败');
        }
    };

    // 打开添加鲜花模态框
    const handleAdd = () => {
        setCurrentFlower(null);
        setCurrentCategory(null);
        setIsFlowerModalVisible(true);
    };

    // 打开编辑鲜花模态框
    const handleEditFlower = (flower) => {
        setCurrentFlower(flower);
        setIsFlowerModalVisible(true);
    };

    // 打开编辑种类模态框
    const handleEditCategory = async (flower) => {
        try {
            const category = await getCategory(flower.flowerId);
            setCurrentCategory(category);
            setIsCategoryModalVisible(true);
        } catch (error) {
            message.error('获取分类信息失败');
        }
    };

    // 提交鲜花表单（添加或编辑）
    const handleFlowerSubmit = async (values) => {
        try {
            if (currentFlower) {
                // 编辑鲜花
                const res = await updateFlower({ flowerId: currentFlower.flowerId, ...values });
                console.log('编辑鲜花结果:', res); // 调试日志
                if (res) { // 根据 updateFlower 的返回值判断是否成功
                    message.success('鲜花信息更新成功');
                } else {
                    message.error('操作失败');
                }
            } else {
                // 添加鲜花
                await onSubmit(values);
            }
            setIsFlowerModalVisible(false); // 关闭模态框
            fetchFlowers(); // 刷新鲜花数据
        } catch (error) {
            console.error('操作失败:', error); // 调试日志
            message.error('操作失败');
        }
    };

    // 提交种类表单
    const handleCategorySubmit = async (values) => {
        try {
            await updateCategory({ flowerId: currentCategory.flowerId, ...values });
            message.success('种类信息更新成功');
            setIsCategoryModalVisible(false);
            fetchFlowers();
        } catch (error) {
            message.error('操作失败');
        }
    };

    // 筛选鲜花
    const filteredFlowers = flowers.filter((flower) =>
        flower.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // 表格列定义
    const columns = [
        { title: '鲜花ID', dataIndex: 'flowerId', key: 'flowerId' },
        { title: '鲜花名称', dataIndex: 'name', key: 'name' },
        { title: '描述', dataIndex: 'description', key: 'description', render: (text) => text },
        { title: '原价', dataIndex: 'originalPrice', key: 'originalPrice', render: (text) => `￥${text}` || '' },
        { title: '折后价', dataIndex: 'discountPrice', key: 'discountPrice', render: (text) => (text ? `￥${text}` : '') },
        { title: '是否在售', dataIndex: 'isOnSale', key: 'isOnSale', render: (text) => (text ? '是' : '否') },
        {
            title: '图片',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text) => (text ? <img src={text} alt="鲜花图片" style={{ width: 50, height: 50 }} /> : '默认图片'),
        },
        { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleString() },
        { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', render: (text) => new Date(text).toLocaleString() },
        {
            title: '编辑种类',
            key: 'editCategory',
            render: (_, record) => (
                <Button type="link" onClick={() => handleEditCategory(record)}>编辑种类</Button>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEditFlower(record)}>编辑信息</Button>
                    <Popconfirm
                        title="确定删除吗？"
                        onConfirm={() => handleDelete(record.flowerId)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 初始化时获取鲜花数据
    useEffect(() => {
        fetchFlowers();
    }, []);

    return (
        <div>
            {/* 表头上方的操作栏 */}
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="搜索鲜花名称"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                />
                <Button type="primary" onClick={handleAdd}>添加鲜花</Button>
            </Space>

            {/* 鲜花表格 */}
            <Table
                dataSource={filteredFlowers}
                columns={columns}
                rowKey="flowerId"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* 添加/编辑鲜花模态框 */}
            <FlowerForm
                visible={isFlowerModalVisible}
                onCancel={() => setIsFlowerModalVisible(false)}
                onSubmit={handleFlowerSubmit}
                currentFlower={currentFlower}
            />

            {/* 编辑种类模态框 */}
            <CategoryForm
                visible={isCategoryModalVisible}
                onCancel={() => setIsCategoryModalVisible(false)}
                onSubmit={handleCategorySubmit}
                currentCategory={currentCategory}
            />
        </div>
    );
};

export default FlowerTable;