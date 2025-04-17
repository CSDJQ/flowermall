import style from './Login.module.scss';
import {Button, Form, Input, Space, Progress} from 'antd';
import {fetchLogin,fetchSignup} from "../../apis/loginAndSignup";
import {useDispatch} from "react-redux";
import { setToken } from "@/store/modules/cus";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {
    validatePassword,
    validatePhone,
    getPasswordStrength
} from "@/utils/validations";

const Login = () => {
    const [loginForm] = Form.useForm();
    const [signupForm] = Form.useForm();

    const showErrorMsg = (errorMsg) => {
        if (errorMsg === '手机号或密码错误') {
            loginForm.setFields([
                {
                    name: 'phone',
                    errors: [errorMsg],
                },
                {
                    name: 'password',
                    errors: [errorMsg],
                },
            ]);
        } else if (errorMsg === '注册失败，手机号已被注册') {
            signupForm.setFields([
                {
                    name:'phone',
                    errors: [errorMsg],
                }
            ]);
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 登录
    const sendLogin = async (values) => {
        const result = await fetchLogin(values);
        if (result.success) {
            dispatch(setToken(result.data));
            navigate('/');
        } else {
            showErrorMsg(result.errorMsg);
        }
    };

    // 注册
    const sendSignup = async (values) => {
        // 检查两次密码是否一致
        if (values.password !== values.chkpassword) {
            signupForm.setFields([
                {
                    name: 'chkpassword',
                    errors: ['两次输入的密码不一致'],
                }
            ]);
            return;
        }

        const result = await fetchSignup(values);
        if (result.success) {
            alert('注册成功，前去登录');
            window.location.reload();
        } else {
            showErrorMsg(result.errorMsg);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // 密码强度提示
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

    useEffect(() => {
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        document.body.style.background = `url("/imgs/background.png") no-repeat center/ cover`;

        return () => {
            document.body.style.background = '';
            document.body.style.display = '';
            document.body.style.justifyContent = '';
            document.body.style.alignItems = '';
        };
    }, []);

    return (
        <div className={style.main}>
            <input type="checkbox" className={style.chk} id="chk" aria-hidden="true"/>
            <div className={style.login}>
                <label htmlFor="chk" aria-hidden="true">登 录</label>
                <div className={style.formBlock}>
                    <Form
                        form={loginForm}
                        name="loginForm"
                        wrapperCol={{span: 30}}
                        onFinish={sendLogin}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入手机号！',
                                },
                                () => ({
                                    validator(_, value) {
                                        if (!value || validatePhone(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('请输入正确的手机号格式'));
                                    },
                                }),
                            ]}
                        >
                            <Input placeholder="输入手机号"/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
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
                            <Input.Password placeholder="输入密码" />
                        </Form.Item>

                        <Form.Item label={null} style={{ textAlign: 'center' }}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                                <Button htmlType="reset">清空</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            <div className={style.signup}>
                <label htmlFor="chk" aria-hidden="true">注 册</label>
                <div className={style.formBlock}>
                    <Form
                        form={signupForm}
                        name="signupForm"
                        wrapperCol={{span: 30}}
                        onFinish={sendSignup}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名！',
                                },
                            ]}
                        >
                            <Input placeholder="输入用户名"/>
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入手机号！',
                                },
                                () => ({
                                    validator(_, value) {
                                        if (!value || validatePhone(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('请输入正确的手机号格式'));
                                    },
                                }),
                            ]}
                        >
                            <Input placeholder="输入手机号"/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入注册密码！',
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
                            <Input.Password placeholder="设置密码" />
                        </Form.Item>

                        <Form.Item
                            name="chkpassword"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message: '请确认注册密码！',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次输入的密码不一致'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="再次输入密码" />
                        </Form.Item>

                        <Form.Item label={null} style={{ textAlign: 'center' }}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    注册
                                </Button>
                                <Button htmlType="reset">清空</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;