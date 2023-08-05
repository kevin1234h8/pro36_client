import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import { AccountInterface } from "../interface/AccountInterface";
import { goBack } from "../utils/navigationUtils";
import Breadcrumb from "../components/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";
import {
  changeDateFormatAndIncrementHour,
  getFormattedDate,
  getIndonesianFormattedDate,
} from "../utils/dateUtils";

const DetailsPage = ({ user, parsedUserData }: any) => {
  const { id } = useParams();
  const [account, setAccount] = useState<AccountInterface>();
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showInvPassword, setShowInvPassword] = useState<boolean>(false);
  const [expiredDate, setExpiredDate] = useState<any>();

  useEffect(() => {
    const getAccount = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/account/${id}`);
        setAccount(res.data.account);
        setExpiredDate(res.data.account.expired_date);
      } catch (err) {
        console.log(err);
      }
    };
    getAccount();
  }, [id]);

  const handleDelete = async () => {
    const values = {
      deleted_by: user.id,
    };
    if (account?.status == "2") {
      toast.error(
        "Cannot delete the account. The account has already been deleted.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        }
      );
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete your account ?"
    );
    if (confirmed) {
      const res = await axios.put(`${BASE_URL}/account/delete/${id}`, values, {
        headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
      });
      if (res.status === 200) {
        setIsSuccessModalVisible(true);
      }
    }
  };

  const goToEditPage = () => {
    if (account?.status == "2") {
      toast.error(
        "Cannot edit the account. The account has already been deleted. Please restored the account!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        }
      );
      return;
    }
    window.location.href = `/new-account/edit-account/${id}`;
  };

  return (
    <div className="dark:bg-[#0e1011]  ">
      <ToastContainer />
      {isSuccessModalVisible ? (
        <SuccessModal
          text={`Account Deleted Successfully`}
          redirectLink={`/new-account`}
        />
      ) : null}
      <Navbar user={user} />
      <Breadcrumb />
      <div className="add-member-container lg:mx-[10rem] dark:text-white   ">
        <div className="add-member-form w-100">
          <h2 className="font-medium add-member-form-title">Account Details</h2>
          <form className="form" action="#">
            <div className="w-full">
              <div className="input-box">
                <input
                  type="text"
                  value={account?.client_name || ""}
                  name=""
                  required
                  readOnly
                />
                <label>Client Name</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  defaultValue={account?.account_no}
                  name=""
                  required
                  readOnly
                />
                <label>Account No</label>
              </div>
              <div className="relative input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue={account?.password}
                  name=""
                  required
                  readOnly
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
                <label>MT4 / MT5 Pass</label>
              </div>
              <div className="relative input-box">
                <input
                  type={showInvPassword ? "text" : "password"}
                  defaultValue={account?.inv_pass}
                  name=""
                  required
                  readOnly
                />
                <div className="absolute top-0 right-0">
                  {showInvPassword ? (
                    <i
                      onClick={() => setShowInvPassword(!showInvPassword)}
                      className="text-indigo-600 fa-solid fa-eye "
                    ></i>
                  ) : (
                    <i
                      onClick={() => setShowInvPassword(!showInvPassword)}
                      className="text-indigo-600 fa-solid fa-eye-slash "
                    ></i>
                  )}
                </div>
                <label>Inv Pass</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  defaultValue={account?.server}
                  name=""
                  required
                  readOnly
                />
                <label>Server</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  defaultValue={account?.ea_name}
                  required
                  readOnly
                />
                <label>EA Name</label>
              </div>
            </div>
            <div className="w-full">
              <div className="input-box">
                <input
                  id="RegistDate"
                  value={changeDateFormatAndIncrementHour(account?.regist_date)}
                  type="text"
                  readOnly
                />
                <label>Regist Date</label>
              </div>
              <div className="input-box">
                <input
                  id="RegistDate"
                  value={changeDateFormatAndIncrementHour(
                    account?.expired_date
                  )}
                  type="text"
                  readOnly
                />
                <label>Expired Date</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  value={account?.serial_key}
                  required
                  readOnly
                />
                <label>Serial Key</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  defaultValue={account?.remark}
                  name=""
                  required
                  readOnly
                />
                <label>Remark</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  defaultValue={account?.vps}
                  name=""
                  required
                  readOnly
                />
                <label>VPS</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  defaultValue={account?.recruit_by}
                />
                <label>Recruit By</label>
              </div>
            </div>
          </form>
          <div className="form-footer">
            <a
              onClick={goToEditPage}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Edit</span>
            </a>
            <div
              onClick={handleDelete}
              className="cursor-pointer rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Delete</span>
            </div>
            <div
              onClick={goBack}
              className=" rounded cursor-pointer px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
