import {createBrowserRouter} from "react-router-dom";
import React from "react";
import Login from "@/views/Login";
import Home from "@/views/Home";
import {AuthRoute} from "@/components/AuthRoute";
import CategoryPage from "@/components/CategoryPage";
import MyLayout from "@/components/MyLayout";
import AdminEdit from "../views/AdminEdit";
import Exit from "../views/Exit";
import Chat from "../components/Chat";
import CartTable from "@/views/CartTable";
import PersonalData from "@/views/PersonalData";
import ModifyPwd from "@/views/ModifyPwd";

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '',
        element: <AuthRoute><MyLayout /></AuthRoute>, // 确保在 Layout 上包裹 AuthRoute 来保护整个 /home 路由
        children: [
            {
                path: '',
                element: <Home />
            },
            {
                path: 'category',
                element: <CategoryPage />
            },
            {
                path: 'adminEdit',
                element: <AdminEdit />,
            },
            {
                path: 'exit',
                element: <Exit />,
            },
            {
                path: 'chat',
                element:<Chat></Chat>
            },
            {
                path: 'shopping',
                element:<CartTable></CartTable>
            },
            {
                path: 'personalData',
                element:<PersonalData></PersonalData>
            },
            {
                path: 'modifyPwd',
                element:<ModifyPwd></ModifyPwd>
            }
        ]
    },
])

export default router;