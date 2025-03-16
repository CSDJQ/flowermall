import style from './Login.module.scss';
import {Button, Form, Input, Space} from 'antd';
import {fetchLogin,fetchSignup} from "../../apis/loginAndSignup";
import {useDispatch} from "react-redux";
import {setToken} from "../../store/modules/cus";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Login = () => {
    const [loginForm] = Form.useForm();
    const [signupForm] = Form.useForm();
    const showErrorMsg = (errorMsg) => {
        // 如果是用户名或密码错误，将错误信息显示到表单的相应字段
        if (errorMsg === '手机号或密码错误') {
            loginForm.setFields([
                {
                    name: 'phone',
                    errors: [errorMsg], // 在用户名字段显示错误
                },
                {
                    name: 'password',
                    errors: [errorMsg], // 在密码字段显示错误
                },
            ]);
        }else if (errorMsg === '注册失败，手机号已被注册') {
            signupForm.setFields([
                {
                    name:'phone',
                    errors: [errorMsg],
                }
            ])
        }
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // 登录
    const sendLogin = async (values) => {
        // 调用封装好的登录 API 函数
        const result = await fetchLogin(values)
        console.log(result);
        if (result.success) {
            // 登录成功后跳转页面
            dispatch(setToken(result.data));
            console.log(result.data);
              // 跳转到 默认首页
            navigate('/');
        } else {
            // 请求失败，显示错误信息
            const errorMsg = result.errorMsg;
            showErrorMsg(errorMsg);
        }
    };
    // 注册
    const sendSignup = async (values) => {
        // 调用封装好的登录 API 函数
        const result = await fetchSignup(values);

        if (result.success) {
            alert('注册成功，前去登录')
            window.location.reload();
        } else {
            // 请求失败，显示错误信息
            const errorMsg = result.errorMsg;
            showErrorMsg(errorMsg);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        // 动态设置 body 的背景
        document.body.style.display = 'flex';
        document.body.style.justifyContent = 'center';
        document.body.style.alignItems = 'center';
        document.body.style.background = `url("/imgs/background.png") no-repeat center/ cover`;

        // 组件卸载时恢复原背景
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
                            wrapperCol={{span: 30,}}
                            onFinish={sendLogin}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        pattern:'^1\\d{10}$',
                                        message: '请输入手机号！',
                                    },
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
                                ]}
                            >
                                <Input.Password placeholder="输入密码" />
                            </Form.Item>

                            <Form.Item label={null}  style={{ textAlign: 'center' }}>
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
                            wrapperCol={{span: 30,}}
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
                                        pattern:'^1\\d{10}$',
                                        message: '请输入手机号！',
                                    },
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
                                ]}
                            >
                                <Input.Password placeholder="设置密码" />
                            </Form.Item>

                            <Form.Item
                                name="chkpassword"
                                rules={[
                                    {
                                        required: true,
                                        message: '请确认注册密码！',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="再次输入密码" />
                            </Form.Item>

                            <Form.Item label={null}  style={{ textAlign: 'center' }}>
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
    )
}
export default Login