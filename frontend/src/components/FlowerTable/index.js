import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Input, Space, Modal, Form, InputNumber, Switch, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getFlowers, deleteFlower, addFlower, updateFlower, getCategory, updateCategory } from '@/apis/flower';

const FlowerTable = () => {
    const [flowers, setFlowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isFlowerModalVisible, setIsFlowerModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [currentFlower, setCurrentFlower] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formFlower] = Form.useForm();
    const [formCategory] = Form.useForm();

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
            console.log(flowerId);
            await deleteFlower(flowerId);
            message.success('删除成功');
            fetchFlowers();
        } catch (error) {
            message.error('删除失败');
        }
    };

    // 打开添加鲜花模态框
    const handleAdd = () => {
        setCurrentFlower(null);
        setCurrentCategory(null);
        formFlower.resetFields();
        formCategory.resetFields();
        setIsFlowerModalVisible(true);
    };

    // 打开编辑鲜花模态框
    const handleEditFlower = (flower) => {
        setCurrentFlower(flower);
        formFlower.setFieldsValue({
            ...flower,
        });
        setIsFlowerModalVisible(true);
    };

    // 打开编辑种类模态框
    const handleEditCategory = async (flower) => {
        try {
            const category = await getCategory(flower.flowerId); // 获取分类信息
            setCurrentCategory(category);
            formCategory.setFieldsValue({
                mainFlower: category.mainFlower,
                purpose: category.purpose,
                colorScheme: category.colorScheme,
                stemCount: category.stemCount,
            });
            setIsCategoryModalVisible(true);
        } catch (error) {
            message.error('获取分类信息失败');
        }
    };

    // 提交鲜花表单（添加或编辑）
    const handleFlowerSubmit = async () => {
        try {
            const values = await formFlower.validateFields();

            if (currentFlower) {
                // 编辑鲜花
                await updateFlower({ id: currentFlower.id, ...values });
                message.success('鲜花信息更新成功');
            } else {
                // 添加鲜花
                const categoryValues = await formCategory.validateFields();
                const flowerData = {
                    ...values,
                    category: {
                        ...categoryValues,
                    },
                };
                await addFlower(flowerData);
                message.success('鲜花添加成功');
            }

            setIsFlowerModalVisible(false);
            fetchFlowers();
        } catch (error) {
            message.error('操作失败');
        }
    };

    // 提交种类表单
    const handleCategorySubmit = async () => {
        try {
            const values = await formCategory.validateFields();

            // 更新分类信息
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
        {
            title: '鲜花ID',
            dataIndex: 'flowerId',
            key: 'flowerId',
        },
        {
            title: '鲜花名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text,
        },
        {
            title: '原价',
            dataIndex: 'originalPrice',
            key: 'originalPrice',
            render: (text) => `￥${text}`||'',
        },
        {
            title: '折后价',
            dataIndex: 'discountPrice',
            key: 'discountPrice',
            render: (text) =>(text ? `￥${text}` : ''),
        },
        {
            title: '是否在售',
            dataIndex: 'isOnSale',
            key: 'isOnSale',
            render: (text) => (text ? '是' : '否'),
        },
        {
            title: '图片',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (text) => (text ? <img src={text} alt="鲜花图片" style={{ width: 50, height: 50 }} /> : '默认图片'),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => new Date(text).toLocaleString(),
        },
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
                    <Button type="link" onClick={() => handleEditFlower(record)}>编辑</Button>
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
            <Modal
                title={currentFlower ? '编辑鲜花' : '添加鲜花'}
                open={isFlowerModalVisible}
                onOk={handleFlowerSubmit}
                onCancel={() => setIsFlowerModalVisible(false)}
            >
                <Form form={formFlower} layout="vertical">
                    <Form.Item name="name" label="鲜花名称" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="originalPrice" label="原价" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="discountPrice" label="折后价">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="isOnSale" label="是否在售" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item name="imageUrl" label="图片">
                        <Upload
                            action="https://your-cos-upload-endpoint"
                            listType="picture"
                            maxCount={1}
                            onChange={(info) => {
                                if (info.file.status === 'done') {
                                    formFlower.setFieldsValue({ imageUrl: info.file.response.url });
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>上传图片</Button>
                        </Upload>


                        <Upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" directory>
                            <Button icon={<UploadOutlined />}>上传图片</Button>
                        </Upload>



                    </Form.Item>
                    {!currentFlower && (
                        <>
                            <Form.Item name="mainFlower" label="主花">
                                <Input />
                            </Form.Item>
                            <Form.Item name="purpose" label="用途">
                                <Input />
                            </Form.Item>
                            <Form.Item name="colorScheme" label="色系">
                                <Input />
                            </Form.Item>
                            <Form.Item name="stemCount" label="支数">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>

            {/* 编辑种类模态框 */}
            <Modal
                title="编辑种类"
                open={isCategoryModalVisible}
                onOk={handleCategorySubmit}
                onCancel={() => setIsCategoryModalVisible(false)}
            >
                <Form form={formCategory} layout="vertical">
                    <Form.Item name="mainFlower" label="主花" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="purpose" label="用途" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="colorScheme" label="色系" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="stemCount" label="支数" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FlowerTable;