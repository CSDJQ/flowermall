import { configureStore } from "@reduxjs/toolkit";
import cusReducer from "./modules/cus";

export default configureStore({
    reducer: {
        cus: cusReducer, // 将 cusReducer 挂载到 cus 键下
    },
});