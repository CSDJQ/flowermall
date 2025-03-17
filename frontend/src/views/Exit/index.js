import { setToken } from "@/store/modules/cus";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const Exit = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setToken(""));  // 清空 token
        localStorage.removeItem("token");  // 清除 token
        window.location.reload();
    }, [dispatch]);  // 空依赖数组确保只在组件挂载时运行一次

    return null;
};

export default Exit;
