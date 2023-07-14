import React from "react";
import Navbar from "../components/Navbar";

const PageNotFoundPage = ({ user }: any) => {
  return (
    <div className="dark:bg-[#0e1011]">
      <Navbar user={user} />
      <div className="flex items-center justify-center min-h-screen py-48">
        <div className="flex flex-col">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-indigo-500 xl:text-7xl lg:text-6xl md:text-5xl">
              404
            </div>

            <div className="mt-10 text-2xl font-bold text-center xl:text-7xl lg:text-6xl md:text-5xl dark:text-white ">
              Page Not Found
            </div>

            <div className="mt-8 text-xs font-medium text-center text-gray-400 md:text-xl lg:text-2xl">
              Sorry, the page you are looking for could not be found.
            </div>
            <div>
              <a
                href="/"
                className="text-xs text-blue-500 underline cursor-pointer hover:text-blue-600"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFoundPage;
