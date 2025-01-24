// 组合redux子模块，导出store实例

import {configureStore} from "@reduxjs/toolkit";
import cusReducer from "./modules/cus";

export default configureStore({
    reducer: cusReducer,
})
