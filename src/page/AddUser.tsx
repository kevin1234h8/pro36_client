import React, { SyntheticEvent, useEffect, useState } from "react";
import ButtonOutline from "../components/ButtonOutline";
import axios from "axios";
import ComboBoxs from "../components/ComboBoxs";
import SuccessModal from "../components/SuccessModal";
import Select from "react-select";
import datas from "../data/datas.json";
import Navbar from "../components/Navbar";
import Compressor from "compressorjs";
import Sidebar from "../components/Sidebar";
import { goBack } from "../utils/navigationUtils";
import { BASE_URL } from "../config/config";
const AddUser = ({
  isOpen,
  user,
  toggleNavigationSidebar,
  isLoggedIn,
}: any) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [level, setLevel] = useState<number>();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [avatar, setAvatar] = useState<any>();
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const values = {
        username,
        password,
        level: level,
        createdBy: user?.id,
        modifiedBy: user?.id,
      };
      const res = await axios.post(`${BASE_URL}/user/create`, values, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setShowErrorMessage(false);
        setIsSuccessModalVisible(true);
      }
    } catch (err) {
      setShowErrorMessage(true);
    }
  };
  console.log(level);

  return (
    <div className="dark:bg-[#0e1011] h-screen ">
      {isSuccessModalVisible ? (
        <SuccessModal
          text="User created successfully!"
          redirectLink="/add-user"
        />
      ) : null}
      <Navbar user={user} />
      <div className="add-member-container  lg:mx-[10rem]  dark:text-white ">
        <div className="add-member-form w-100">
          <h2 className="add-member-form-title">Add User</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="w-full">
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  className="dark:text-white"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label className="dark:text-white">Username</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
              </div>
              <div className="input-box">
                <select
                  className="dark:bg-[#0e1011] dark:text-white"
                  onChange={(e) => setLevel(parseInt(e.target.value))}
                >
                  <option value="" hidden>
                    Level
                  </option>
                  <option value="1" className="text-black">
                    Master
                  </option>
                  <option value="2" className="text-black">
                    Admin
                  </option>
                  <option value="3" className="text-black">
                    User
                  </option>
                </select>
                <label>Level</label>
              </div>
            </div>
            {showErrorMessage ? (
              <div className="mb-5 text-xs text-center text-red-500 ">
                Username already exists
              </div>
            ) : null}
            <div className="form-footer">
              <button
                type="submit"
                className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-xs">Save</span>
              </button>

              <div
                onClick={goBack}
                className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-xs">Cancel</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
