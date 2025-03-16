import React from "react";
import style from "./Home.module.scss"
import SwiperItem from "../../components/HomePage/SwiperItem";
import Main from "../../components/HomePage/Main";

const Home = () => {
    return (
        <>
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
