import {createBrowserRouter} from "react-router-dom";
import React from "react";
import Login from "@/views/Login";
import Home from "@/views/Home";
import {AuthRoute} from "@/components/AuthRoute";
import CategoryPage from "@/components/CategoryPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/home',
        element: <AuthRoute><Home /></AuthRoute>,
    },
    {
        path: '/category/:category', // 动态路由
        element: <CategoryPage />, // 分类页面
    },
])

export default router;