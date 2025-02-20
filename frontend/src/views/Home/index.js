import React from "react";
import style from "./Home.module.scss"
import SwiperItem from "../../components/HomePage/SwiperItem";
import TopBar from "../../components/TopBar";
import Main from "../../components/HomePage/Main";

const Home = () => {
    return (
        <>
            <TopBar></TopBar>
            <div className={style.container}>
                <SwiperItem></SwiperItem>
            </div>
            <div className={style.container}>
                <Main></Main>
            </div>

        </>
    );
};

export default Home;
