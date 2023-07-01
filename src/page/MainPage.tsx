import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Lottie from "react-lottie";
import Navbar from "../components/Navbar";
import tradingAnimation from "../lottie/114986-ultimate-trading-experience.json";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";

// Import Swiper styles
import "swiper/css";

const MainPage = ({ user }: any) => {
  const widthStyle = useContainerWidthUtils();
  console.log("widthStyle", widthStyle);
  useEffect(() => {
    AOS.init({
      once: true,
    });
  });

  const lottieTradingAnimation = {
    loop: true,
    autoplay: true,
    animationData: tradingAnimation,
  };

  return (
    <div>
      <div>
        <Navbar user={user} />

        <div className="flex flex-col-reverse items-center justify-center mx-auto bg lg:flex-row lg:px-48 lg:py-10">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-12">
              <div className="flex-col hidden gap-4 lg:flex ">
                <div
                  data-aos="fade-right"
                  className="text-xl text-center lg:text-start md:text-3xl lg:text-6xl"
                >
                  New
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-duration="1000"
                  className="text-xl text-center lg:text-start md:text-3xl lg:text-6xl"
                >
                  Technology
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-duration="1150"
                  className="text-xl text-center lg:text-start md:text-3xl lg:text-6xl"
                >
                  Forex
                </div>
                <div
                  data-aos="fade-right"
                  data-aos-duration="1300"
                  className="text-xl text-center lg:text-start md:text-3xl lg:text-6xl"
                >
                  Trading
                </div>
              </div>
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="mt-5 text-xl font-bold text-center md:text-2xl">
                  Organize Simplify Your Account Data Management
                </div>
                <div className="text-xs text-center md:text-base text-[#727272]">
                  Effortlessly handle and monitor your data with ease. Stay
                  organized, efficient, and in control with Pro 36
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <a
                  href="/login"
                  data-aos="fade-down"
                  data-aos-duration="1450"
                  className="relative inline-flex items-center justify-center w-48 p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-indigo-500 rounded-full shadow-md group"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-500 group-hover:translate-x-0 ease">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-xs text-indigo-500 transition-all duration-300 transform md:text-base lg:text-base group-hover:translate-x-full ease">
                    Get Started
                  </span>
                  <span className="relative invisible text-[8px] md:text-base lg:text-base">
                    Button Text
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            {/* <img
            data-aos="fade-left"
            data-aos-duration="1500"
            src={tradingChart}
            className=""
            alt=""
          /> */}
            {widthStyle != "100%" ? (
              <Lottie
                options={lottieTradingAnimation}
                height={250} // Set the height of the animation
                width={250} // Set the width of the animation
                speed={0.5}
              />
            ) : (
              <Lottie
                options={lottieTradingAnimation}
                height={450} // Set the height of the animation
                width={450} // Set the width of the animation
                speed={0.5}
              />
            )}
          </div>
          {/* <div className="font-bold text-center">pro 36</div> */}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
