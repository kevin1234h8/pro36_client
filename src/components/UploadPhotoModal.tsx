import React, { useRef } from "react";
import "../scss/hiddenFile.css";
const UploadPhotoModal = ({ setIsUploadPhotoModal }: any) => {

  return (
    <div
      className=" min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-[100] outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        <div className="absolute top-0 right-0">
          <i
            onClick={() => setIsUploadPhotoModal(false)}
            className="fa-solid fa-xmark"
          ></i>
        </div>
        <div className="relative">
          <div className="text-center p-5 flex-auto justify-center">
            <h2 className="text-xl font-bold py-4 ">Change Profile Photo</h2>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <form action="">
              <input
                type="file"
                name="file"
                id="file-input"
                className="visuallyhidden"
              />
            </form>
            <a href="#" className="file-upload">
              File upload
            </a>
            <button className="file-upload">File upload</button>
            <button className="mb-2 md:mb-0 bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600">
              {/* <a href={redirectLink} className="text-white hover:text-white">
              Ok
            </a> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
