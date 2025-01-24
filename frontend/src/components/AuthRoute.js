// 路由守卫组件
import {getToken} from "../utils/token";
import {Navigate} from "react-router-dom";


// 接收路由组件函数
export function AuthRoute({children}){
    const TOKEN = getToken();
    if (TOKEN) {
        return <>{children}</>
    }else {
        return <Navigate to={'/'} replace/>
    }
}
