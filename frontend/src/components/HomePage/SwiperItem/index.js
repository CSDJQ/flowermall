import React from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'

// import required modules
import {A11y, Autoplay, Navigation, Pagination, Scrollbar} from 'swiper';

const SwiperItem = () => {

    const slides = [
        { backgroundImage: `url("/imgs/swiper1.jpg")`, content: 'Slide 2' },
        { backgroundImage: `url("/imgs/swiper2.jpg")`, content: 'Slide 3' },
        { backgroundImage: `url("/imgs/swiper3.jpg")`, content: 'Slide 1' },
        { backgroundImage: `url("/imgs/swiper4.jpg")`, content: 'Slide 2' },
        { backgroundImage: `url("/imgs/swiper5.jpg")`, content: 'Slide 3' },
    ];

    return (
        <>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
                autoplay={{
                    delay: 2500, // 每个滑块的停留时间（毫秒）
                    disableOnInteraction: false, // 当用户交互时是否暂停自动播放
                }}
                loop
                navigation
            >
                {/* 渲染 slides 数组中的每个 Slide */}
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            style={{
                                backgroundImage: slide.backgroundImage,
                                backgroundSize: 'cover', // 使背景图像覆盖整个容器
                                backgroundPosition: 'center', // 确保背景图居中显示
                                backgroundRepeat: 'no-repeat', // 防止背景图像重复
                                height: '300px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'transparent',
                            }}
                        >
                            <h2>{slide.content}</h2>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}

export default SwiperItem;
