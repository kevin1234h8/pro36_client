import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { SyntheticEvent, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../lottie/63787-secure-login.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config/config";
const LoginPage = ({ setUser, setLoginInfo, setShowToast }: any) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const navigate = useNavigate();

  const setCookie = (name: string, value: any, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      const values = {
        username: username,
        password: password,
      };
      const res = await axios.post(`${BASE_URL}/user/login`, values, {
        withCredentials: true,
      });
      setLoginInfo(res.data);
      console.log(res.data);
      if (res.status === 200) {
        setShowErrorMessage(false);
        setCookie("isLogin", true, 7);
        localStorage.setItem("showToast", JSON.stringify(true));
        sessionStorage.setItem("userData", JSON.stringify(res.data));
        if (res.data.data.level === 3) {
          document.cookie = `jwt=${res.data.accessToken}; max-age=${
            3 * 24 * 60 * 60
          }; path=/;`;
          localStorage.setItem("activeMenu", "Input Invoice");
          navigate("/input-invoice");
        } else {
          document.cookie = `jwt=${res.data.accessToken}; max-age=${
            3 * 24 * 60 * 60
          }; path=/;`;
          localStorage.setItem("activeMenu", "New Account");
          navigate("/new-account");
        }
        window.location.reload();
      }
    } catch (err) {
      toast.error("Login unsuccessful", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      setShowErrorMessage(true);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex h-screen dark:bg-[#303037]">
        <div className="items-center justify-around hidden w-full bg-white lg:flex lg:w-1/2 login_img_section">
          <Lottie animationData={animationData} height={500} width={500} />
        </div>
        <div className="flex items-center justify-center w-full space-y-8 lg:w-1/2">
          <div className="w-full px-8 md:px-32 lg:px-24 bg-white dark:bg-[#303037]">
            <form
              onSubmit={handleSubmit}
              className="p-5 bg-white dark:bg-[#101010] rounded-md shadow-2xl"
            >
              <h1 className="my-10 mb-1 text-2xl font-bold text-center text-gray-800 dark:text-white">
                Hello Again!
              </h1>
              <p className="my-4 mb-8 text-sm font-normal text-center text-gray-600 dark:text-[#8b8b8b]">
                Welcome Back to Pro 36
              </p>
              <div
                // className={`flex items-center  mb-4 border-2  py-2 px-3 rounded-2xl ${
                //   usernameErrorMessage
                //     ? "border-red-500 text-red-500"
                //     : username.length > 0
                //     ? "border-green-500 text-green-500"
                //     : "border-gray-300"
                // }`}
                className={`flex items-center  mb-4 border-2  py-2 px-3 rounded-2xl `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  id="username"
                  className={`pl-2 w-full outline-none border-none my dark:bg-[#101010] dark:text-white ${
                    usernameErrorMessage ? "border-red-500" : "border-gray-300"
                  }`}
                  type="username"
                  name="username"
                  placeholder="Username"
                  required
                  pattern="^[a-z_-]{3,15}$"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    // if (!/^[a-z_-]{3,15}$/.test(username)) {
                    //   setUsernameErrorMessage(
                    //     "Invalid username. Username should  be 3-15 characters long and not consist any number or special character."
                    //   );
                    // } else {
                    //   setUsernameErrorMessage("");
                    // }
                  }}
                />
              </div>
              {/* {usernameErrorMessage ? (
                <div className="my-8 mt-1 text-sm text-red-500">
                  {usernameErrorMessage}
                </div>
              ) : null}
              {username && !usernameErrorMessage && (
                <div className="my-8 mt-1 text-sm text-green-500">
                  Success! Username is valid.
                </div>
              )} */}
              <div
                // className={`flex items-center border-2 mb-6 py-2 px-3 rounded-2xl ${
                //   passwordErrorMessage
                //     ? "border-red-500 text-red-500"
                //     : password.length > 0
                //     ? "border-green-500 text-green-500"
                //     : "border-gray-300"
                // }`}
                className={`flex items-center border-2 mb-6 py-2 px-3 rounded-2xl `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <div
                  className={`w-full outline-none border-none flex items-center justify-center  `}
                >
                  <input
                    className={`pl-2 w-full outline-none border-none my bg-white dark:bg-[#101010] dark:text-white ${
                      passwordErrorMessage
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#_?!@$%^&*-]).{8,20}$"
                    placeholder="Password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // if (
                      //   !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#_?!@$%^&*-]).{7,20}$/.test(
                      //     password
                      //   )
                      // ) {
                      //   setPasswordErrorMessage(
                      //     "Invalid password. Password should be 8-20 characters long and have at least a number, one special character, one capital letter."
                      //   );
                      // } else {
                      //   setPasswordErrorMessage("");
                      // }
                    }}
                  />

                  {showPassword ? (
                    <i
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-indigo-600 fa-solid fa-eye "
                    ></i>
                  ) : (
                    <i
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-indigo-600 fa-solid fa-eye-slash "
                    ></i>
                  )}
                </div>
              </div>
              {/* {passwordErrorMessage ? (
                <div className="my-8 mt-1 text-sm text-red-500">
                  {passwordErrorMessage}
                </div>
              ) : null}
              {password && !passwordErrorMessage && (
                <div className="my-8 mt-1 text-sm text-green-500">
                  Success! Password is valid.
                </div>
              )}
              {showErrorMessage ? (
                <div className="text-sm text-center text-red-500">
                  Wrong Username and Password Combination
                </div>
              ) : null} */}

              <button
                type="submit"
                className="block w-full py-2 mt-5 mb-2 font-semibold text-white transition-all duration-500 bg-indigo-600 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1"
              >
                Login
              </button>
              <a
                href="/"
                className="flex items-center justify-center mt-4 text-xs text-blue-500 underline cursor-pointer hover:text-blue-600"
              >
                back to home
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
