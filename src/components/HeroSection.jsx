import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const banners = [
  "https://t3.ftcdn.net/jpg/03/14/28/96/360_F_314289607_ADADbnGr64dpGnddyhZPidCoc6jgKiHK.jpg",
  "https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/92f75f8f3d4a75cb.jpg?q=20",
  "https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/37f50c9f1a98f85c.jpg?q=20",
];

export default function HeroSection() {
  return (
    <div className="w-full bg-white shadow">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
      >
        {banners.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img src={img} alt={`Banner ${idx}`} className="w-full h-64 object-fill" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
