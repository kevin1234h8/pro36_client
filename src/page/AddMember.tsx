import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { v4 } from "uuid";
import Datepicker from "react-tailwindcss-datepicker";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import "../scss/addmember.css";
import { goBack } from "../utils/navigationUtils";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSpinner from "../components/LoadingSpinner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getFormattedDate } from "../utils/dateUtils";

const AddMember = ({ setNotificationCount, user, parsedUserData }: any) => {
  let uuidv4: string;
  uuidv4 = v4();
  const [loading, setLoading] = useState(false);
  const date = new Date();

  const oneYearLaterDate = new Date(date);
  oneYearLaterDate.setFullYear(date.getFullYear() + 1);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showInvPassword, setShowInvPassword] = useState<boolean>(false);

  const [showRegistDateCalendar, setShowRegistDateCalendar] =
    useState<boolean>(false);
  const [showExpiredDateCalendar, setShowExpiredDateCalendar] =
    useState<boolean>(false);

  const [id] = useState<string>(uuidv4);
  const [clientName, setClientName] = useState<string>("");
  const [accountNo, setAccountNumber] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [invPassword, setInvPassword] = useState<string>("");
  const [server, setServer] = useState<string>("");
  const [eaName, setEaName] = useState<string>("");
  const [serialKey, setSerialKey] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [vps, setVps] = useState<string>("");
  const [recruitBy, setRecruitBy] = useState<string>("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  const [value, onChange] = useState<any>(new Date());
  const [valueExpiredDate, onChangeExpiredDate] =
    useState<any>(oneYearLaterDate);

  // const getFormattedDate = (dateStr: any) => {
  //   const date = new Date(dateStr);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  const formattedYYYYMMDDDate = getFormattedDate(value);
  const formattedYYYYMMDDExpiredDate = getFormattedDate(valueExpiredDate);
  const formattedRegistDate = value
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

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
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Regular expression to match dd-mm-yyyy format
      if (
        !dateRegex.test(formattedRegistDate) ||
        !dateRegex.test(formattedExpiredDate)
      ) {
        // Display an error message if the date format is incorrect
        alert(
          "Invalid regist date or expired date  format , Please use the format dd-mm-yyyy. For example, 17-05-2023."
        );
        return;
      }

      const values = {
        id,
        client_name: clientName,
        account_no: accountNo,
        password,
        inv_pass: invPassword,
        server,
        ea_name: eaName,
        regist_date: formattedYYYYMMDDDate,
        expired_date: formattedYYYYMMDDExpiredDate,
        serial_key: serialKey,
        remark,
        vps,
        recruit_by: recruitBy,
        created_by: user?.id,
        owner: user?.id,
        createdName: user?.username,
      };
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/account/create`, values, {
        headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
      });
      if (res.status === 200) {
        const storedNotificationCount =
          localStorage.getItem("notificationCount");
        const currentCount =
          storedNotificationCount !== null
            ? parseInt(storedNotificationCount)
            : 0;
        const newCount = currentCount + 1;

        localStorage.setItem("notificationCount", newCount.toString());
        setLoading(false);
        setNotificationCount(newCount);
        setIsSuccessModalVisible(true);
      }
    } catch (err) {
      console.log(err);
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
      <Navbar parsedUserData={parsedUserData} user={user} />
      <Breadcrumb />
      {isSuccessModalVisible ? (
        <SuccessModal
          text={"User created successfully"}
          redirectLink={"/new-account"}
        />
      ) : null}
      <div className="add-member-container lg:mx-[10rem] dark:text-white ">
        <div className="add-member-form w-100">
          <h2 className="font-medium add-member-form-title">Add Account</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="w-full">
              <div className="input-box">
                <input
                  type="hidden"
                  name=""
                  required
                  defaultValue={id}
                  readOnly
                />
              </div>
              <div className="input-box">
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <label>Client Name</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  name=""
                  required
                  onChange={(e) => setAccountNumber(parseInt(e.target.value))}
                />
                <label>Account No</label>
              </div>
              <div className="relative input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name=""
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
                  required
                  onChange={(e) => setEaName(e.target.value)}
                />
                <label>EA Name</label>
              </div>
            </div>
            <div className="w-full ">
              <div className="relative input-box">
                <div className="flex items-start text-xs text-[#ffb226]">
                  Regist Date
                </div>
                <input value={formattedRegistDate} readOnly />
                <div
                  onClick={() =>
                    setShowRegistDateCalendar(!showRegistDateCalendar)
                  }
                  className="absolute top-0 right-0 cursor-pointer"
                >
                  <i className="fa-solid fa-calendar"></i>
                </div>
              </div>
              {showRegistDateCalendar ? (
                <div className="flex justify-end mb-8 md:mb-8 lg:mb-0">
                  <Calendar onChange={changeDate} value={value} />
                </div>
              ) : null}

              <div className="relative input-box">
                <input
                  id="RegistDate"
                  type="text"
                  value={formattedExpiredDate}
                  readOnly
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
                <div className="flex justify-end mb-8 md:mb-8 lg:mb-0">
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
                  min={1}
                  onChange={(e) => setSerialKey(e.target.value)}
                />
                <label>Serial Key</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  onChange={(e) => setRemark(e.target.value)}
                />
                <label>Remark</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  onChange={(e) => setVps(e.target.value)}
                />
                <label>VPS</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  onChange={(e) => setRecruitBy(e.target.value)}
                />
                <label>Recruit By</label>
              </div>
            </div>
            <div className="form-footer">
              <button
                type="submit"
                className=" rounded cursor-pointer px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-xs">Save</span>
              </button>

              <div
                onClick={goBack}
                className=" rounded cursor-pointer px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
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

export default AddMember;
