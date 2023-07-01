import React, { useEffect, useState } from "react";
import sidebarIcon from "../assets/sidebar.png";
import AOS from "aos";
import "aos/dist/aos.css";
import account from "../assets/account.png";
const Sidebar = ({ user }: any) => {
  const [activeMenu, setActiveMenu] = useState<string>("");
  useEffect(() => {
    AOS.init({
      once: true,
    });
  });
  useEffect(() => {
    const storedActiveItem = localStorage.getItem("activeMenu");
    if (storedActiveItem) {
      setActiveMenu(storedActiveItem);
    }
  }, []);

  const handleClick = (menu: string) => {
    setActiveMenu(menu);
    localStorage.setItem("activeMenu", menu);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log("userLevel : ", user?.level);
  return (
    <>
      {isSidebarOpen ? null : (
        <div
          data-aos="fade-left"
          onClick={toggleSidebar}
          className="z-20 flex rounded-full shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 fixed top-2/4 -translate-y-2/4 left-6 flex-col border"
        >
          <img
            src={sidebarIcon}
            alt=""
            className="w-[12px] md:w-[16px] lg:w-[24px]"
          />
        </div>
      )}

      {isSidebarOpen ? (
        <nav
          data-aos="fade-right"
          className="z-20  flex shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg dark:border-slate-600/60 dark:bg-slate-800/50 fixed top-1/4 -translate-y-1/4 left-2 min-h-[auto] min-w-[64px] flex-col rounded-lg border"
        >
          {user != undefined && (user?.level === 1 || user?.level === 2) ? (
            <a
              onClick={() => handleClick("New Account")}
              href="/new-account"
              className={`flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 ${
                activeMenu === "New Account"
                  ? " bg-indigo-50 text-indigo-600"
                  : ""
              }`}
            >
              <i className="fa-solid fa-circle-user text-[20px]"></i>

              <small className="text-center text-[8px] md:text-[12px] lg:text-xs font-medium">
                New Account
              </small>
            </a>
          ) : null}
          {user != undefined && (user?.level === 1 || user?.level === 2) ? (
            <a
              onClick={() => handleClick("Ex Account")}
              href="/ex-account"
              className={`flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 ${
                activeMenu === "Ex Account"
                  ? " bg-indigo-50 text-indigo-600"
                  : ""
              }`}
            >
              <i className="fa-solid fa-user-slash text-[20px]"></i>

              <small className="text-center text-[8px] md:text-[12px] lg:text-xs font-medium">
                Ex Account
              </small>
            </a>
          ) : null}
          <a
            onClick={() => handleClick("Input Invoice")}
            href="/input-invoice"
            className={`flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 ${
              activeMenu === "Input Invoice"
                ? " bg-indigo-50 text-indigo-600"
                : ""
            }`}
          >
            <i className="fa fa-user-plus text-[20px]"></i>

            <small className="text-center text-[8px] md:text-[12px] lg:text-xs font-medium">
              Input Invoice
            </small>
          </a>
          {user != undefined && user?.level === 1 ? (
            <a
              onClick={() => handleClick("Add User")}
              href="/add-user"
              className={`flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 ${
                activeMenu === "Add User" ? " bg-indigo-50 text-indigo-600" : ""
              }`}
            >
              <i className="fa-solid fa-receipt text-[20px]"></i>

              <small className="text-center text-[8px] md:text-[12px] lg:text-xs font-medium">
                Add User
              </small>
            </a>
          ) : null}

          <hr className="dark:border-gray-700/60" />

          <a
            onClick={toggleSidebar}
            className="flex flex-col items-center justify-center w-full h-8 gap-1 text-fuchsia-900 dark:text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </a>
        </nav>
      ) : null}
    </>
  );
};

export default Sidebar;
