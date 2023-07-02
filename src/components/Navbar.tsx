import axios from "axios";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import UploadPhotoModal from "./UploadPhotoModal";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config/config";
import LoadingSpinner from "./LoadingSpinner";
import useLoading from "../hooks/useLoading";
const Navbar = ({ user }: any) => {
  const [open, setOpen] = React.useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [avatar, setAvatar] = useState<any>({});
  const [isUploadPhotoModal, setIsUploadPhotoModal] = useState<boolean>(false);
  const [errorUploadAvatar, setErrorUploadAvatar] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useLoading();
  const navigate = useNavigate();
  console.log(avatar === undefined);
  useEffect(() => {
    const getAvatar = async () => {
      const res = await axios.get(`${BASE_URL}/avatar/${user?.id}`);
      setAvatar(res.data.avatar);
    };

    getAvatar();
  }, [user?.id]);

  const logout = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/logout`);
      if (res.status === 200) {
        document.cookie =
          "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const deleteCookie = (name: string) => {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitPhoto = async (e: any) => {
    e.preventDefault();

    const form = formRef.current;
    if (form) {
      const formData = new FormData(form);
      formData.append("userId", user?.id);

      try {
        const res = await axios.post(`${BASE_URL}/stats`, formData);
        if (res.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        toast.error("Only JPEG and PNG file formats are allowed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      {isUploadPhotoModal ? (
        <UploadPhotoModal setIsUploadPhotoModal={setIsUploadPhotoModal} />
      ) : null}
      <div className="sticky top-0 w-full bg-white  dark:bg-[#0e1011] dark:border-gray-700 z-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-8">
          <div className="flex items-center justify-between py-6 border-gray-100 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="/">
                <span className="sr-only">Workflow</span>
                <div className="flex items-center gap-4">
                  <i className="fa-solid fa-chart-simple text-[#055ef9] text-lg md:text-xl lg:text-2xl "></i>
                  <div
                    onClick={() => handleClick("")}
                    className="text-base md:text-xl lg:text-xl dark:text-white"
                  >
                    Pro36
                  </div>
                </div>
              </a>
            </div>

            <div className="mr-2 -my-2 md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
                onClick={() => setOpen(!open)}
              >
                <span className="sr-only">Open menu</span>
                {/* Heroicon name: outline/menu */}
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
            <nav className="hidden space-x-10 md:flex">
              {user != undefined && (user?.level === 1 || user?.level === 2) ? (
                <div className="flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-red-500 dark:text-gray-500">
                  <a
                    href="/new-account"
                    className={`text-base  font-medium text-gray-400 hover:text-gray-900 dark:hover:text-red-500 dark:text-gray-500 ${
                      activeMenu === "New Account"
                        ? " text-gray-900 dark:text-red-500"
                        : ""
                    }`}
                    onClick={() => handleClick("New Account")}
                  >
                    New Account
                  </a>
                </div>
              ) : null}
              {user != undefined && (user?.level === 1 || user?.level === 2) ? (
                <div className="flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-red-500 dark:text-gray-500">
                  <a
                    href="/ex-account"
                    className={`text-base  font-medium text-gray-400 hover:text-gray-900 dark:hover:text-red-500 dark:text-gray-500 ${
                      activeMenu === "Ex Account"
                        ? " text-gray-900 dark:text-red-500"
                        : ""
                    }`}
                    onClick={() => handleClick("Ex Account")}
                  >
                    Ex Account
                  </a>
                </div>
              ) : null}

              {user != undefined ? (
                <div className="flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-red-500 dark:text-gray-500">
                  <a
                    href="/input-invoice"
                    className={`text-base  font-medium text-gray-400 hover:text-gray-900 dark:hover:text-red-500 dark:text-gray-500 ${
                      activeMenu === "Input Invoice"
                        ? " text-gray-900 dark:text-red-500"
                        : ""
                    }`}
                    onClick={() => handleClick("Input Invoice")}
                  >
                    Input Invoice
                  </a>
                </div>
              ) : null}

              {user != undefined && user?.level === 1 ? (
                <div className="flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-red-500 dark:text-gray-500">
                  <a
                    href="/add-user"
                    className={`text-base   font-medium text-gray-400 hover:text-gray-900 dark:hover:text-red-500 dark:text-gray-500 ${
                      activeMenu === "Add User"
                        ? " text-gray-900 dark:text-red-500"
                        : ""
                    }`}
                    onClick={() => handleClick("Add User")}
                  >
                    Add User
                  </a>
                </div>
              ) : null}
            </nav>
            {user ? (
              <div className="items-center justify-end hidden gap-4 md:flex md:flex-1 lg:w-0">
                <form
                  ref={formRef}
                  className="relative"
                  onSubmit={handleSubmitPhoto}
                >
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer"
                    onClick={handleImageClick}
                  >
                    {avatar === null || avatar === undefined ? (
                      <div className="relative flex items-center justify-center w-12 h-12 m-1 mr-2 text-xl text-white uppercase bg-blue-500 rounded-full">
                        <i className="fa fa-user"></i>
                      </div>
                    ) : (
                      <img
                        className="object-cover rounded-full w-14 h-14"
                        src={`${BASE_URL}/uploads/${avatar?.path}`}
                        alt="image"
                      />
                    )}
                  </label>

                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    className="hidden"
                    name="uploaded_file"
                    onChange={handleSubmitPhoto}
                  />
                </form>

                <div className="text-base font-medium text-gray-500 whitespace-nowrap hover:text-gray-900">
                  {user?.username}
                </div>
                <div
                  onClick={logout}
                  className="inline-flex items-center justify-center px-4 py-2 ml-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm whitespace-nowrap hover:bg-indigo-700"
                >
                  logout
                </div>
              </div>
            ) : (
              <div className="items-center justify-end hidden md:flex md:flex-1 lg:w-0">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 ml-8 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm whitespace-nowrap hover:bg-indigo-700"
                >
                  login
                </a>
              </div>
            )}
          </div>
        </div>

        <div
          className={
            open
              ? "opacity-100  transition ease-out duration-200 absolute top-0 inset-x-0 p-2  transform origin-top-right md:hidden"
              : "hidden scale-0 absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
          }
        >
          <div className="bg-white divide-y-2 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 divide-gray-50">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <i className="text-indigo-600 fa-solid fa-chart-simple"></i>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setOpen(!open)}
                  >
                    <span className="sr-only">Close menu</span>
                    {/* Heroicon name: outline/x */}
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <div className="flex items-center gap-4">
                    <form
                      ref={formRef}
                      className="relative"
                      onSubmit={handleSubmitPhoto}
                    >
                      <label
                        htmlFor="file-input"
                        className="cursor-pointer"
                        onClick={handleImageClick}
                      >
                        {avatar === null || avatar === undefined ? (
                          <div className="relative flex items-center justify-center w-12 h-12 m-1 mr-2 text-xl text-white uppercase bg-blue-500 rounded-full">
                            <i className="fa fa-user"></i>
                          </div>
                        ) : (
                          <img
                            className="object-cover rounded-full w-14 h-14"
                            src={`${BASE_URL}/uploads/${avatar?.path}`}
                            alt="image"
                          />
                        )}
                      </label>

                      <input
                        type="file"
                        id="file-input"
                        accept="image/*"
                        className="hidden"
                        name="uploaded_file"
                        onChange={handleSubmitPhoto}
                      />
                    </form>
                    <div>{user?.username}</div>
                  </div>
                  {user != undefined &&
                  (user?.level === 1 || user?.level === 2) ? (
                    <a
                      href="/new-account"
                      className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                    >
                      <div className="text-indigo-600 fa-solid fa-user navigation-sidebar-icon"></div>
                      <span className="ml-3 text-base font-medium text-gray-900">
                        New Account
                      </span>
                    </a>
                  ) : null}
                  {user != undefined &&
                  (user?.level === 1 || user?.level === 2) ? (
                    <a
                      href="/ex-account"
                      className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                    >
                      <div className="text-indigo-600 fa-solid fa-users navigation-sidebar-icon"></div>
                      <span className="ml-3 text-base font-medium text-gray-900">
                        Ex Account
                      </span>
                    </a>
                  ) : null}
                  {user != undefined ? (
                    <a
                      href="/input-invoice"
                      className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                    >
                      <div className="text-indigo-600 fa-solid fa-user navigation-sidebar-icon"></div>
                      <span className="ml-3 text-base font-medium text-gray-900">
                        Input Invoice
                      </span>
                    </a>
                  ) : null}
                  {user != undefined && user?.level === 1 ? (
                    <a
                      href="/add-user"
                      className="flex items-center p-3 -m-3 rounded-md hover:bg-gray-50"
                    >
                      <div className="text-indigo-600 fa-solid fa-user navigation-sidebar-icon"></div>
                      <span className="ml-3 text-base font-medium text-gray-900">
                        Add User
                      </span>
                    </a>
                  ) : null}
                </nav>
              </div>
            </div>
            <div className="px-5 py-6 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8"></div>
              <div>
                {user ? (
                  <div
                    onClick={logout}
                    className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                  >
                    Logout
                  </div>
                ) : (
                  <a
                    href="/login"
                    className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                  >
                    Login
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
