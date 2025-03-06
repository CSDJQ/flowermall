import {createBrowserRouter} from "react-router-dom";
import React from "react";
import Login from "@/views/Login";
import Home from "@/views/Home";
import {AuthRoute} from "@/components/AuthRoute";
import CategoryPage from "@/components/CategoryPage";
import MyLayout from "@/components/MyLayout";
import AdminEdit from "../components/AdminEdit";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/home',
        element: <AuthRoute><MyLayout /></AuthRoute>, // 确保在 Layout 上包裹 AuthRoute 来保护整个 /home 路由
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'category/:parentKey/:childKey',
                element: <CategoryPage />
            },
        ]
    },
    {
        path: '/adminEdit',
        element: <AdminEdit />,
    },
])

export default router;