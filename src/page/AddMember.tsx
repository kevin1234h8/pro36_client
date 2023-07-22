import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { v4 } from "uuid";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import "../scss/addmember.css";
import { goBack } from "../utils/navigationUtils";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSpinner from "../components/LoadingSpinner";

const AddMember = ({ setNotificationCount, user, parsedUserData }: any) => {
  const [loading, setLoading] = useState(false);
  const date = new Date();
  const oneYearLaterDate = new Date(date);
  oneYearLaterDate.setFullYear(date.getFullYear() + 1);
  let uuidv4: string;
  uuidv4 = v4();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showInvPassword, setShowInvPassword] = useState<boolean>(false);
  const [registDate, setRegistDate] = useState<any>(
    date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-")
  );

  const [expiredDate, setExpiredDate] = useState<string>(
    oneYearLaterDate
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-")
  );
  const [id] = useState<string>(uuidv4);
  const [clientName, setClientName] = useState<string>("");
  const [accountNo, setAccountNumber] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [invPassword, setInvPassword] = useState<string>("");
  const [server, setServer] = useState<string>("");
  const [eaName, setEaName] = useState<string>("");
  const [serialKey, setSerialKey] = useState<number>(0);
  const [remark, setRemark] = useState<string>("");
  const [vps, setVps] = useState<string>("");
  const [recruitBy, setRecruitBy] = useState<string>("");

  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Regular expression to match dd-mm-yyyy format
      if (!dateRegex.test(registDate) || !dateRegex.test(expiredDate)) {
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
        regist_date: registDate,
        expired_date: expiredDate,
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
        withCredentials: true,
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
          <h2 className="add-member-form-title">Add Account</h2>
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
                {/* <label>No ID</label> */}
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
            <div className="w-full">
              <div className="input-box">
                <input
                  id="RegistDate"
                  type="text"
                  defaultValue={registDate}
                  onChange={(e) => setRegistDate(e.target.value)}
                />
                <label>Regist Date</label>
              </div>

              <div className="input-box">
                <input
                  id="RegistDate"
                  type="text"
                  defaultValue={expiredDate}
                  onChange={(e) => {
                    setExpiredDate(e.target.value);
                  }}
                />
                <label>Expired Date</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  name=""
                  min={1}
                  onChange={(e) => setSerialKey(parseInt(e.target.value))}
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

export default AddMember;
