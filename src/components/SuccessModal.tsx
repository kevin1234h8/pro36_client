import checkAnimation from "../lottie/99592-checkmark.json";
import Lottie from "lottie-react";

const SuccessModal = ({ text, redirectLink }: any) => {
  // const lottieCheckAnimation = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: checkAnimation,
  // };
  return (
    <div
      className=" min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-[100] outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute inset-0 z-0 bg-black opacity-80"></div>
      <div className="relative w-full max-w-lg p-5 mx-auto my-auto bg-white shadow-lg rounded-xl ">
        <div className="relative">
          <div className="justify-center flex-auto p-5 text-center">
            <Lottie animationData={checkAnimation} width={200} height={200} />
            <h2 className="py-4 text-xl font-bold ">Success</h2>
            <p className="px-8 text-sm text-gray-500">{text}</p>
          </div>
          <div className="p-3 mt-2 space-x-4 text-center md:block">
            <button className="px-5 py-2 mb-2 text-sm font-medium tracking-wider text-white bg-green-500 border border-green-500 rounded-full shadow-sm md:mb-0 hover:shadow-lg hover:bg-green-600">
              <a href={redirectLink} className="text-white hover:text-white">
                Ok
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
