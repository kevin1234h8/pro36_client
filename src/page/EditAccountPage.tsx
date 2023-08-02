import React, { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AccountInterface } from "../interface/AccountInterface";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import { goBack } from "../utils/navigationUtils";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSpinner from "../components/LoadingSpinner";
import Calendar from "react-calendar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";
import {
  changeDateFormatToDDMMYYYY,
  formatDateFromLongStringToDDMMYYYY,
  formatDateToYYYYMMDD,
  getFormattedDate,
  getIndonesianFormattedDate,
} from "../utils/dateUtils";

const EditAccountPage = ({ user }: any) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      const getAccount = async () => {
        const res = await axios.get(`${BASE_URL}/account/${id}`);
        setAccount(res.data.account);
        setClientName(res.data.account.client_name);
        setAccountNo(res.data.account.account_no);
        setPassword(res.data.account.password);
        setInvPassword(res.data.account.inv_pass);
        setServer(res.data.account.server);
        setEaName(res.data.account.ea_name);
        setSerialKey(res.data.account.serial_key);
        setRemark(res.data.account.remark);
        setVps(res.data.account.vps);
        setRecruitBy(res.data.account.recruit_by);
        setRegistDate(res.data.account.regist_date);
        setExpiredDate(res.data.account.expired_date);
      };
      getAccount();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const [account, setAccount] = useState<AccountInterface>();
  const [clientName, setClientName] = useState<string>("");
  const [accountNo, setAccountNo] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [invPassword, setInvPassword] = useState<string>("");
  const [server, setServer] = useState<string>("");
  const [eaName, setEaName] = useState<string>("");
  const [serialKey, setSerialKey] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [vps, setVps] = useState<string>("");
  const [recruitBy, setRecruitBy] = useState<string>("");
  const [expiredDate, setExpiredDate] = useState<string>("");
  const [registDate, setRegistDate] = useState<string>("");
  const [isSuccessModelIsVisible, setIsSuccessModelIsVisible] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showInvPassword, setShowInvPassword] = useState<boolean>(false);

  const [showRegistDateCalendar, setShowRegistDateCalendar] =
    useState<boolean>(false);
  const [showExpiredDateCalendar, setShowExpiredDateCalendar] =
    useState<boolean>(false);

  const date = new Date();
  const oneYearLaterDate = new Date(date);
  oneYearLaterDate.setFullYear(date.getFullYear() + 1);

  const parseDateString = (dateString: any) => {
    const parts = dateString.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Subtract 1 to get zero-based month
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  function formatDate(inputDateStr: any) {
    const date = new Date(inputDateStr);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  }

  function formatDateToLongString(inputDateStr: any) {
    const date = new Date(inputDateStr);

    const options: any = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    return date.toLocaleString("en-US", options);
  }

  const formattedDateToLongString = formatDateToLongString(registDate);
  const formattedDateasd = formatDate(registDate);

  const inputDateStr =
    "Tue Aug 01 2023 00:00:00 GMT+0700 (Western Indonesia Time)";
  const newaad = new Date(inputDateStr);

  const year = newaad.getFullYear();
  const month = String(newaad.getMonth() + 1).padStart(2, "0");
  const day = String(newaad.getDate()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;

  const [value, onChange] = useState<any>(
    parseDateString(getIndonesianFormattedDate(getFormattedDate(registDate)))
  );
  const [valueExpiredDate, onChangeExpiredDate] = useState<any>(
    parseDateString(getIndonesianFormattedDate(getFormattedDate(expiredDate)))
  );
  useEffect(() => {
    const formattedRegistDate = getIndonesianFormattedDate(
      getFormattedDate(registDate)
    );
    const formattedExpiredDate = getIndonesianFormattedDate(
      getFormattedDate(expiredDate)
    );

    onChange(parseDateString(formattedRegistDate));
    onChangeExpiredDate(parseDateString(formattedExpiredDate));
  }, [registDate, expiredDate]);

  // useEffect(() => {
  //   onChange(parseDateString(registDate));
  //   onChangeExpiredDate(parseDateString(expiredDate));
  // }, [registDate, expiredDate]);

  // const formattedRegistDate = value
  //   .toLocaleDateString("en-GB", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   })
  //   .replace(/\//g, "-");
  const formatRegistDateToDDMMYYYY = changeDateFormatToDDMMYYYY(value);
  const formatExpiredDateToDDMMYYYY =
    formatDateFromLongStringToDDMMYYYY(valueExpiredDate);

  const formatRegistDateToYYYYMMDD = formatDateToYYYYMMDD(
    formatRegistDateToDDMMYYYY
  );
  const formatExpiredDateToYYYYMMDD = formatDateToYYYYMMDD(
    formatExpiredDateToDDMMYYYY
  );

  const formattedRegistDate = getIndonesianFormattedDate(
    getFormattedDate(registDate)
  );
  const formattedExpiredDate = valueExpiredDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
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
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Regular expression to match dd-mm-yyyy format
      if (
        !dateRegex.test(formattedRegistDate) ||
        !dateRegex.test(formattedExpiredDate)
      ) {
        alert(
          "Invalid regist date or expired date  format , Please use the format dd-mm-yyyy. For example, 17-05-2023."
        );
        return;
      }

      e.preventDefault();
      const values = {
        client_name: clientName,
        account_no: accountNo,
        password,
        inv_pass: invPassword,
        server,
        ea_name: eaName,
        regist_date: formatRegistDateToYYYYMMDD,
        expired_date: formatExpiredDateToYYYYMMDD,
        serial_key: serialKey,
        remark,
        vps,
        recruit_by: recruitBy,
        modified_by: user?.id,
      };
      setLoading(true);
      const res = await axios.put(`${BASE_URL}/account/${id}`, values);
      if (res.status === 200) {
        setLoading(false);
        setIsSuccessModelIsVisible(true);
      }
    } catch (error) {
      setIsSuccessModelIsVisible(false);
    }
  };

  const changeDate = (e: any) => {
    onChange(e);
    setShowRegistDateCalendar(false); // Close the calendar after selecting a date
  };

  const changeExpiredDate = (e: any) => {
    onChangeExpiredDate(e);
    setShowExpiredDateCalendar(false); // Close the calendar after selecting a date
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="dark:bg-[#0e1011] ">
      <ToastContainer />
      {isSuccessModelIsVisible ? (
        <SuccessModal
          redirectLink="/new-account"
          text="Account has been edited successfully"
        />
      ) : null}
      <Navbar user={user} />
      <Breadcrumb />
      <div className="add-member-container lg:mx-[10rem] dark:text-white ">
        <div className="add-member-form w-100">
          <h2 className="font-medium add-member-form-title">Edit Account</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="w-full">
              <div className="input-box">
                <input
                  type="text"
                  name="client_name"
                  value={clientName}
                  required
                  onChange={(e) => setClientName(e.target.value)}
                />
                <label>Client Name</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  name="account_no"
                  value={accountNo}
                  required
                  onChange={(e) => setAccountNo(parseInt(e.target.value))}
                />
                <label>Account No</label>
              </div>
              <div className="relative input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  name="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
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
                  name=""
                  value={invPassword}
                  onChange={(e) => setInvPassword(e.target.value)}
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
                  value={server}
                  name=""
                  required
                  onChange={(e) => setServer(e.target.value)}
                />
                <label>Server</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  value={eaName}
                  required
                  onChange={(e) => setEaName(e.target.value)}
                />
                <label>EA Name</label>
              </div>
            </div>
            <div className="w-full">
              <div className="relative input-box">
                <input
                  id="RegistDate"
                  value={formatRegistDateToDDMMYYYY}
                  type="text"
                  required
                  // onChange={(e) => setRegistDate(e.target.value)}
                />
                <div
                  onClick={() =>
                    setShowRegistDateCalendar(!showRegistDateCalendar)
                  }
                  className="absolute top-0 right-0 cursor-pointer"
                >
                  <i className="fa-solid fa-calendar"></i>
                </div>
                <label>Regist Date</label>
              </div>
              {showRegistDateCalendar ? (
                <div className="flex justify-end">
                  <Calendar onChange={changeDate} value={value} />
                </div>
              ) : null}
              <div className="input-box">
                <input
                  id="ExpiredDate"
                  value={formatExpiredDateToDDMMYYYY}
                  type="text"
                  onChange={(e) => setExpiredDate(e.target.value)}
                />
                <div
                  onClick={() =>
                    setShowExpiredDateCalendar(!showExpiredDateCalendar)
                  }
                  className="absolute top-0 right-0 cursor-pointer"
                >
                  <i className="fa-solid fa-calendar"></i>
                </div>
                <label>Expired Date</label>
              </div>
              {showExpiredDateCalendar ? (
                <div className="flex justify-end">
                  <Calendar
                    onChange={changeExpiredDate}
                    value={valueExpiredDate}
                  />
                </div>
              ) : null}
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  value={serialKey}
                  onChange={(e) => setSerialKey(e.target.value)}
                />
                <label>Serial Key</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  value={remark}
                  name=""
                  onChange={(e) => setRemark(e.target.value)}
                />
                <label>Remark</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  value={vps}
                  name=""
                  onChange={(e) => setVps(e.target.value)}
                />
                <label>VPS</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  value={recruitBy}
                  onChange={(e) => setRecruitBy(e.target.value)}
                />
                <label>Recruit By</label>
              </div>
            </div>
            <div className="form-footer">
              <button
                type="submit"
                className="cursor-pointer  rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-xs">Save</span>
              </button>

              <div
                onClick={goBack}
                className=" cursor-pointer rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white cursor-pointer opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-xs">Cancel</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccountPage;
