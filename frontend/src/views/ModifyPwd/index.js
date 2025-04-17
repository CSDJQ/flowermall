import React from 'react';
import { Card, Form, Input, Button, message, Progress } from 'antd';
import { changePassword } from '@/apis/user';
import style from './ModifyPwd.module.scss';
import { validatePassword, getPasswordStrength } from '@/utils/validations';

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

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const passwordStrengthIndicator = (password) => {
        if (!password) return null;

        const strength = getPasswordStrength(password);
        const color = ["blue", "red", "yellow", "orange"][strength];

        return (
            <div>
                <div>密码需至少8位，包含大小写字母和数字</div>
                <Progress percent={strength*25} size="small" strokeColor={color} showInfo={false} />
            </div>
        );
    };

    return (
        <div className={style.container}>
            <Card title="修改密码" className={style.sectionCard}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className={style.securityForm}
                >
                    <Form.Item
                        name="oldPassword"
                        label="旧密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入旧密码'
                            }
                        ]}
                    >
                        <Input.Password placeholder="请输入当前密码" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="新密码"
                        rules={[
                            {
                                required: true,
                                message: '请输入新密码'
                            },
                            () => ({
                                validator(_, value) {
                                    if (!value || validatePassword(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(passwordStrengthIndicator(value));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="请输入新密码" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={['newPassword']}
                        rules={[
                            {
                                required: true,
                                message: '请确认新密码'
                            },
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

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={style.submitButton}
                            loading={loading}
                            block
                        >
                            修改密码
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ModifyPwd;