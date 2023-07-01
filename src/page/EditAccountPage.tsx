import React, { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AccountInterface } from "../interface/AccountInterface";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";

const EditAccountPage = ({ user }: any) => {
  const { id } = useParams();
  useEffect(() => {
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
  }, []);
  const [account, setAccount] = useState<AccountInterface>();

  const [clientName, setClientName] = useState<string>("");
  const [accountNo, setAccountNo] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [invPassword, setInvPassword] = useState<string>("");
  const [server, setServer] = useState<string>("");
  const [eaName, setEaName] = useState<string>("");
  const [serialKey, setSerialKey] = useState<number>(0);
  const [remark, setRemark] = useState<string>("");
  const [vps, setVps] = useState<string>("");
  const [recruitBy, setRecruitBy] = useState<string>("");
  const [expiredDate, setExpiredDate] = useState<string>("");
  const [registDate, setRegistDate] = useState<string>("");
  const [isSuccessModelIsVisible, setIsSuccessModelIsVisible] =
    useState<boolean>(false);

  console.log("password : ", password);

  const handleSubmit = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      const values = {
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
        modified_by: user?.id,
      };
      const res = await axios.put(`${BASE_URL}/account/${id}`, values);
      if (res.status === 200) {
        setIsSuccessModelIsVisible(true);
      }
      console.log(res);
    } catch (error) {
      setIsSuccessModelIsVisible(false);
    }
  };

  console.log(account?.client_name);
  console.log("client_name : ", account?.client_name);
  console.log("client_name : ", clientName);

  const goBack = () => {
    window.history.back();
  };
  console.log(account);
  return (
    <div className="dark:bg-[#0e1011] ">
      {isSuccessModelIsVisible ? (
        <SuccessModal
          redirectLink="/"
          text="Account has been edited successfully"
        />
      ) : null}
      <Navbar user={user} />
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
              <div className="input-box">
                <input
                  type="password"
                  value={password}
                  name="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>MT4 / MT5 Pass</label>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  value={invPassword}
                  name="inv_pass"
                  required
                  onChange={(e) => setInvPassword(e.target.value)}
                />
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
              <div className="input-box">
                <input
                  id="RegistDate"
                  value={registDate}
                  type="text"
                  required
                  onChange={(e) => setRegistDate(e.target.value)}
                />
                <label>Regist Date</label>
              </div>
              <div className="input-box">
                <input
                  id="ExpiredDate"
                  value={expiredDate}
                  type="text"
                  onChange={(e) => setExpiredDate(e.target.value)}
                />
                <label>Expired Date</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  value={serialKey}
                  required
                  onChange={(e) => setSerialKey(parseInt(e.target.value))}
                />
                <label>Serial Key</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  value={remark}
                  name=""
                  required
                  onChange={(e) => setRemark(e.target.value)}
                />
                <label>Remark</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  value={vps}
                  name=""
                  required
                  onChange={(e) => setVps(e.target.value)}
                />
                <label>VPS</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  value={recruitBy}
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

export default EditAccountPage;
