import axios from "axios";
import { SyntheticEvent, useState } from "react";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import { goBack } from "../utils/navigationUtils";

const AddUser = ({ user, parsedUserData }: any) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [level, setLevel] = useState<number>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [passwordInputErrorMessage, setPasswordInputErrorMessage] = useState<
    string[]
  >([]);
  const [showSuccessPassword, setShowSuccessPassword] =
    useState<boolean>(false);
  const [showPasswordInputErrorMessage, setShowPasswordInputErrorMessage] =
    useState<boolean>(false);

  const handlePasswordChange = (e: any) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const errors = [];

    // Check for minimum 8 characters
    if (newPassword.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    // Check for numbers
    if (!/\d/.test(newPassword)) {
      errors.push("Password must include at least one number.");
    }

    // Check for symbols
    if (!/[#_?!@$%^&*-]/.test(newPassword)) {
      errors.push("Password must include at least one symbol. ");
    }
    setShowSuccessPassword(true);
    setPasswordInputErrorMessage(errors);
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (passwordInputErrorMessage.length > 0) {
      alert("Invalid password. Please input a valid password and try again.");
      return;
    }
    try {
      const values = {
        username,
        password,
        level: level,
        createdBy: user?.id,
        modifiedBy: user?.id,
      };
      const res = await axios.post(`${BASE_URL}/user/create`, values, {
        headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
      });
      if (res.status === 200) {
        setShowErrorMessage(false);
        setIsSuccessModalVisible(true);
      }
    } catch (err) {
      setShowErrorMessage(true);
      setShowPasswordInputErrorMessage(true);
    }
  };

  return (
    <div className="dark:bg-[#0e1011] h-screen ">
      {isSuccessModalVisible ? (
        <SuccessModal
          text="User created successfully!"
          redirectLink="/add-user"
        />
      ) : null}
      <Navbar user={user} parsedUserData={parsedUserData} />
      <div className="add-member-container  lg:mx-[10rem]  dark:text-white  ">
        <div className="add-member-form w-100">
          <h2 className="add-member-form-title">Add User</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="w-full">
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  minLength={3}
                  maxLength={20}
                  className="dark:text-white"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label className="dark:text-white">Username</label>
              </div>
              <div className="relative input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  maxLength={20}
                  name=""
                  required
                  onChange={handlePasswordChange}
                  // onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute top-0 right-0">
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
                <label>Password</label>
                {/* {password && !passwordErrorMessage && (
                  <div className="my-8 mt-1 text-sm text-green-500">
                    Success! Password is valid.
                  </div>
                )} */}
                {passwordInputErrorMessage.length > 0 ? (
                  <div className="mb-8">
                    {passwordInputErrorMessage.map((message) => {
                      return (
                        <div className="text-xs text-red-500 text-start">
                          {message}
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {showSuccessPassword ? (
                  <div>
                    {passwordInputErrorMessage.length === 0 ? (
                      <div className="mb-8 text-xs text-green-500 text-start">
                        Password is valid.
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {/* Password Error Messages */}
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
