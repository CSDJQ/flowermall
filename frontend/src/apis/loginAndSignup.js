import { request } from "../utils";
import { setupTokenAutoRefresh } from "./auth";
import { sha256 } from 'crypto-hash';

const preprocessPassword = async (password) => {
    return await sha256(password);
};

const fetchLogin = async (values) => {
    try {
        // SHA256预处理密码，避免明文传输
        const processedValues = {
            ...values,
            password: await preprocessPassword(values.password)
        };

        const response = await request.post('/login', processedValues);

        if (response.code === 200) {
            setupTokenAutoRefresh(); // 开启定时刷新
            return { success: true, data: response.data };
        } else {
            return { success: false, errorMsg: response.msg };
        }
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        alert(error.response ? error.response.data.message : error.message);
        return { success: false, errorMsg: error.message };
    }
};

const fetchSignup = async (values) => {
    try {
        // SHA256预处理密码
        const processedValues = {
            ...values,
            password: await preprocessPassword(values.password)
        };

        const response = await request.post('/signup', processedValues);

        if (response.code === 200) {
            return { success: true, data: response };
        } else {
            return { success: false, errorMsg: response.msg };
        }
    } catch (error) {
        alert(error.response ? error.response.data.message : error.message);
        console.error('Signup failed:', error.response ? error.response.data : error.message);
        return { success: false, errorMsg: error.message };
    }
}

export { fetchLogin, fetchSignup }