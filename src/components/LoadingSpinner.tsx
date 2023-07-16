import React from "react";
import loading from "../assets/loading.gif";
const LoadingSpinner = () => {
  return (
    // <div id="loader" className="loader-container">
    //   <div className="spinner"></div>
    // </div>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0e1011]"
      // style={{ background: "rgba(0,0,0,0.3" }}
    >
      <img src={loading} alt="" className="w-[40px]" />
    </div>
  );
};

export default LoadingSpinner;
