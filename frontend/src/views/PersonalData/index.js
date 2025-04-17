import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    message,
    Modal,
    Table,
    Space,
    Popconfirm,
    Checkbox,
} from 'antd';
import {
    getUserInfo,
    updateUserInfo,
    getShippingAddresses,
    addShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
    setDefaultAddress
} from '@/apis/user';
import style from './PersonalData.module.scss';

const PersonalData = () => {
    const [userInfo, setUserInfo] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [addressForm] = Form.useForm();
    const [userInfoForm] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState({
        userInfo: false,
        addresses: false,
        saving: false,
        addressAction: false
    });

    // 验证规则
    const validationRules = {
        username: [
            { required: true, message: '请输入用户名' },
            { max: 50, message: '用户名不能超过50个字符' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-]+$/, message: '只能包含中文、英文、数字、下划线和减号' }
        ],
        phone: [
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' }
        ],
        receiverName: [
            { required: true, message: '请输入收货人姓名' },
            { max: 20, message: '不能超过20个字符' }
        ],
        receiverPhone: [
            { required: true, message: '请输入收货人电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号' }
        ],
        district: [
            { required: true, message: '请输入区/县信息' },
            { max: 50, message: '不能超过50个字符' }
        ],
        detailedAddress: [
            { required: true, message: '请输入详细地址' },
            { max: 100, message: '不能超过100个字符' }
        ]
    };

    // 加载用户数据和收货地址
    useEffect(() => {
        fetchUserData();
        fetchAddresses();
    }, []);

    const fetchUserData = async () => {
        setLoading(prev => ({ ...prev, userInfo: true }));
        try {
            const res = await getUserInfo();
            if (res.code === 200) {
                setUserInfo(res.data);
                userInfoForm.setFieldsValue({
                    username: res.data.username,
                    phone: res.data.phone
                });
            }
        } catch (error) {
            message.error('获取用户信息失败');
        } finally {
            setLoading(prev => ({ ...prev, userInfo: false }));
        }
    };

    const fetchAddresses = async () => {
        setLoading(prev => ({ ...prev, addresses: true }));
        try {
            const res = await getShippingAddresses();
            if (res.code === 200) {
                setAddresses(res.data);
            }
        } catch (error) {
            message.error('获取收货地址失败');
        } finally {
            setLoading(prev => ({ ...prev, addresses: false }));
        }
    };

    // 进入编辑模式
    const handleEdit = () => {
        setEditMode(true);
    };

    // 取消编辑
    const handleCancel = () => {
        userInfoForm.resetFields();
        setEditMode(false);
    };

    // 保存编辑
    const handleSave = async () => {
        setLoading(prev => ({ ...prev, saving: true }));
        try {
            const values = await userInfoForm.validateFields();
            const res = await updateUserInfo(values);
            if (res.code === 200) {
                message.success('个人信息更新成功');
                setUserInfo(values);
                setEditMode(false);
                if (res.data?.token) {
                    // 如果有新token，处理token更新逻辑
                }
            } else {
                message.error(res.msg || '更新失败');
            }
        } catch (error) {
            if (!error.errorFields) {
                message.error('更新个人信息失败');
            }
        } finally {
            setLoading(prev => ({ ...prev, saving: false }));
        }
    };

    // 格式化手机号显示
    const formatPhone = (phone) => {
        if (!phone) return '';
        return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    };

    // 收货地址操作
    const handleAddAddress = async () => {
        setLoading(prev => ({ ...prev, addressAction: true }));
        try {
            const values = await addressForm.validateFields();
            const res = await addShippingAddress(values);
            if (res.code === 200) {
                message.success('收货地址添加成功');
                setIsModalVisible(false);
                addressForm.resetFields();
                fetchAddresses();
            }
        } catch (error) {
            if (!error.errorFields) {
                message.error('添加收货地址失败');
            }
        } finally {
            setLoading(prev => ({ ...prev, addressAction: false }));
        }
    };

    const handleUpdateAddress = async () => {
        setLoading(prev => ({ ...prev, addressAction: true }));
        try {
            const values = await addressForm.validateFields();
            const res = await updateShippingAddress({
                ...values,
                addressId: editingAddress.addressId
            });
            if (res.code === 200) {
                message.success('收货地址更新成功');
                setIsModalVisible(false);
                addressForm.resetFields();
                setEditingAddress(null);
                fetchAddresses();
            }
        } catch (error) {
            if (!error.errorFields) {
                message.error('更新收货地址失败');
            }
        } finally {
            setLoading(prev => ({ ...prev, addressAction: false }));
        }
    };

    const handleDeleteAddress = async (addressId) => {
        setLoading(prev => ({ ...prev, addressAction: true }));
        try {
            const res = await deleteShippingAddress(addressId);
            if (res.code === 200) {
                message.success('收货地址删除成功');
                fetchAddresses();
            }
        } catch (error) {
            message.error('删除收货地址失败');
        } finally {
            setLoading(prev => ({ ...prev, addressAction: false }));
        }
    };

    const handleSetDefaultAddress = async (addressId) => {
        setLoading(prev => ({ ...prev, addressAction: true }));
        try {
            const res = await setDefaultAddress(addressId);
            if (res.code === 200) {
                message.success('默认地址设置成功');
                fetchAddresses();
            }
        } catch (error) {
            message.error('设置默认地址失败');
        } finally {
            setLoading(prev => ({ ...prev, addressAction: false }));
        }
    };

    // 打开添加/编辑地址模态框
    const showAddressModal = (address = null) => {
        setEditingAddress(address);
        if (address) {
            addressForm.setFieldsValue({
                ...address,
                isDefault: address.isDefault || false
            });
        } else {
            addressForm.resetFields();
        }
        setIsModalVisible(true);
    };

    const addressColumns = [
        {
            title: '收货人',
            dataIndex: 'receiverName',
            key: 'receiverName',
        },
        {
            title: '电话',
            dataIndex: 'receiverPhone',
            key: 'receiverPhone',
            render: phone => formatPhone(phone)
        },
        {
            title: '地址',
            key: 'address',
            render: (_, record) => (
                `${record.district} ${record.detailedAddress}`
            ),
        },
        {
            title: '默认地址',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render: isDefault => isDefault ? '是' : '否',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => showAddressModal(record)}
                        disabled={loading.addressAction}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除这个地址吗？"
                        onConfirm={() => handleDeleteAddress(record.addressId)}
                        disabled={loading.addressAction}
                    >
                        <Button type="link" danger disabled={loading.addressAction}>
                            删除
                        </Button>
                    </Popconfirm>
                    {!record.isDefault && (
                        <Popconfirm
                            title="确定设为默认地址吗？"
                            onConfirm={() => handleSetDefaultAddress(record.addressId)}
                            disabled={loading.addressAction}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="link" disabled={loading.addressAction}>
                                设为默认
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className={style.container}>
            <Card
                title="个人信息"
                className={style.sectionCard}
                loading={loading.userInfo}
                extra={!editMode && (
                    <Button type="link" onClick={handleEdit}>修改</Button>
                )}
            >
                <Form
                    form={userInfoForm}
                    layout="vertical"
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={validationRules.username}
                    >
                        {editMode ? (
                            <Input
                                placeholder="请输入用户名"
                                allowClear
                                disabled={loading.saving}
                            />
                        ) : (
                            <div className={style.readOnlyText}>{userInfo.username}</div>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={validationRules.phone}
                    >
                        {editMode ? (
                            <Input
                                placeholder="请输入手机号"
                                allowClear
                                disabled={loading.saving}
                            />
                        ) : (
                            <div className={style.readOnlyText}>{formatPhone(userInfo.phone)}</div>
                        )}
                    </Form.Item>

                    {editMode && (
                        <div className={style.editActions}>
                            <Button
                                type="primary"
                                onClick={handleSave}
                                loading={loading.saving}
                                className={style.submitButton}
                            >
                                保存
                            </Button>
                            <Button
                                onClick={handleCancel}
                                disabled={loading.saving}
                                style={{ marginLeft: 8 }}
                            >
                                取消
                            </Button>
                        </div>
                    )}
                </Form>
            </Card>

            <Card
                title="收货地址管理"
                className={style.sectionCard}
                loading={loading.addresses}
                extra={
                    <Button
                        type="primary"
                        onClick={() => showAddressModal()}
                        disabled={loading.addressAction}
                    >
                        添加新地址
                    </Button>
                }
            >
                <Table
                    className={style.addressTable}
                    columns={addressColumns}
                    dataSource={addresses}
                    rowKey="addressId"
                    pagination={false}
                    loading={loading.addressAction}
                    locale={{
                        emptyText: '暂无收货地址'
                    }}
                />
            </Card>

            <Modal
                title={editingAddress ? '编辑收货地址' : '添加收货地址'}
                open={isModalVisible}
                onOk={editingAddress ? handleUpdateAddress : handleAddAddress}
                onCancel={() => {
                    setIsModalVisible(false);
                    addressForm.resetFields();
                    setEditingAddress(null);
                }}
                confirmLoading={loading.addressAction}
                destroyOnClose
                forceRender
            >
                <Form form={addressForm} layout="vertical">
                    <Form.Item
                        name="receiverName"
                        label="收货人姓名"
                        rules={validationRules.receiverName}
                    >
                        <Input placeholder="请输入收货人姓名" />
                    </Form.Item>
                    <Form.Item
                        name="receiverPhone"
                        label="收货人电话"
                        rules={validationRules.receiverPhone}
                    >
                        <Input placeholder="请输入收货人电话" />
                    </Form.Item>
                    <Form.Item
                        name="district"
                        label="区/县"
                        rules={validationRules.district}
                    >
                        <Input placeholder="例如：番禺区" />
                    </Form.Item>
                    <Form.Item
                        name="detailedAddress"
                        label="详细地址"
                        rules={validationRules.detailedAddress}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="例如：华南理工大学大学城校区"
                        />
                    </Form.Item>
                    <Form.Item
                        name="isDefault"
                        label="是否默认地址"
                        valuePropName="checked"
                    >
                        <Checkbox>设为默认地址</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PersonalData;