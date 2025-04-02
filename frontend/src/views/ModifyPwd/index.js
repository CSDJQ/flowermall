import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { changePassword } from '@/apis/user';
import style from './ModifyPwd.module.scss';

const ModifyPwd = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await changePassword(values.oldPassword, values.newPassword);
            if (res.code === 200) {
                message.success('密码修改成功');
                form.resetFields();
            } else {
                message.error(res.msg || '密码修改失败');
            }
        } catch (error) {
            message.error('密码修改失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.container}>
            <Card title="修改密码" className={style.sectionCard}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className={style.securityForm}
                >
                    <Form.Item
                        name="oldPassword"
                        label="旧密码"
                        rules={[{ required: true, message: '请输入旧密码' }]}
                    >
                        <Input.Password placeholder="请输入当前密码" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[{ required: true, message: '请输入新密码' }]}
                    >
                        <Input.Password placeholder="请输入新密码" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: '请确认新密码' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="请再次输入新密码" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        className={style.submitButton}
                        loading={loading}
                    >
                        修改密码
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ModifyPwd;