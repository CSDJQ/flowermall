import {request} from "../utils";

const fetchLogin = async (values) => {
    try {
        const response = await request.post('/login', values);  // 使用 await 等待请求结果
        // 请求成功
        if (response.code === 200) {
            return { success: true, data: response.data };  // 返回成功结果
        } else {
            return { success: false, errorMsg: response.msg };  // 返回失败信息
        }
    } catch (error) {
        // 请求失败时的错误处理
        console.error('Login failed:', error.response ? error.response.data : error.message);
        alert(error.response ? error.response.data.message : error.message);
        return { success: false, errorMsg: error.message };  // 返回错误信息
    }
};

const fetchSignup = async (values) => {
    try {
        // 发起注册请求并等待结果
        const response = await request.post('/signup', values);

        // 判断请求是否成功
        if (response.code === 200) {
            return { success: true, data: response };  // 返回成功结果
        } else {
            return { success: false, errorMsg: response.msg };  // 返回失败信息
        }
    } catch (error) {
        // 请求失败时的错误处理
        alert(error.response ? error.response.data.message : error.message);
        console.error('Signup failed:', error.response ? error.response.data : error.message);
        return { success: false, errorMsg: error.message };  // 返回错误信息
    }
}

export {fetchLogin, fetchSignup}
