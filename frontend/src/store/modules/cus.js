// 顾客相关的状态管理
import {createSlice} from '@reduxjs/toolkit';
import {setToken as _setToken,getToken,removeToken as _removeToken} from "../../utils/token";

const cusStore = createSlice({
    name: 'cus',
    // 数据状态
    initialState: {
        token:getToken()||''
    },
    // 同步修改方法
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            _setToken(action.payload);
        },
        removeToken: (state, action) => {
            _removeToken();
        }
    }
})

const {setToken,removeToken} = cusStore.actions

const cusReducer = cusStore.reducer

export {setToken,removeToken}

export default cusReducer