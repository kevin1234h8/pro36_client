import React, { useEffect, useState } from "react";
import { AccountInterface } from "../interface/AccountInterface";
import axios from "axios";
import datas from "../data/datas.json";
import { BASE_URL } from "../config/config";
import {
  changeDateFormatAndIncrementHour,
  getIndonesianFormattedDateUNION,
} from "../utils/dateUtils";
const DetailModal = ({ accountId, setIsDetailModalVisible }: any) => {
  const [exAccount, setExAccount] = useState<AccountInterface>();
  useEffect(() => {
    try {
      const getAccount = async () => {
        const res = await axios.get(`${BASE_URL}/account/${accountId}`);
        setExAccount(res.data.account);
      };
      getAccount();
    } catch (err) {
      console.log(err);
    }
  }, [accountId]);
  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-[100] outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute inset-0 z-0 bg-black opacity-80"></div>
      <div className="relative w-full max-w-lg p-5 mx-auto my-auto bg-white shadow-lg rounded-xl ">
        <div className="relative">
          <div className="absolute top-0 right-0">
            <i
              onClick={() => setIsDetailModalVisible(false)}
              className="cursor-pointer fa-solid fa-xmark"
            ></i>
          </div>
          <div className="justify-center flex-auto p-5 text-center">
            <h2 className="py-4 text-xl font-bold ">Details</h2>
            <p className="px-8 text-sm text-gray-500"></p>
          </div>
          <div className="flex items-center w-full">
            <div className="w-full details-container">
              <div className="detail-item">
                <div className="detail-title">Regist Date</div>
                <div className="detail-value">
                  {changeDateFormatAndIncrementHour(exAccount?.regist_date)}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-title">Client Name</div>
                <div className="detail-value">{exAccount?.client_name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-title">Account No</div>
                <div className="detail-value">{exAccount?.account_no}</div>
              </div>
              <div className="detail-item">
                <div className="detail-title">Server</div>
                <div className="detail-value">{exAccount?.server}</div>
              </div>
              <div className="detail-item">
                <div className="detail-title">Expired Date</div>
                <div className="detail-value">
                  {changeDateFormatAndIncrementHour(exAccount?.expired_date)}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-title">Ea Name</div>
                <div className="detail-value">{exAccount?.ea_name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-title">Remark</div>
                <div className="detail-value">{exAccount?.remark}</div>
              </div>
              <div className="detail-item">
                <div className="detail-title">VPS</div>
                <div className="detail-value">{exAccount?.vps}</div>
              </div>
              <div className="detail-item">
                <div className="detail-title">Recruit By</div>
                <div className="detail-value">{exAccount?.recruit_by}</div>
              </div>
            </div>
            {/* <div className="flex flex-col w-2/4 gap-2 px-8">
              {datas.account_detail_modal.map((data) => {
                return <div>{data.name}</div>;
              })}
            </div>
            <div className="flex flex-col w-2/4 gap-2">
              <div>{exAccount?.regist_date}</div>
              <div>{exAccount?.client_name}</div>
              <div>{exAccount?.account_no}</div>
              <div>{exAccount?.server}</div>
              <div>{exAccount?.expired_date}</div>
              <div>{exAccount?.ea_name}</div>
              <div>{exAccount?.remark}</div>
              <div>{exAccount?.vps}</div>
              <div>{exAccount?.recruit_by}</div>
            </div> */}
          </div>
          <div className="p-3 mt-2 space-x-4 text-center md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
