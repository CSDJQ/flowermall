import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../../components/TopBar";
import style from "./MyLayout.module.scss";

const Layout = () => {
    return (
        <>
            <TopBar />
            <div className={style.container}>
                {/* Outlet 用来渲染子页面的具体内容 */}
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
