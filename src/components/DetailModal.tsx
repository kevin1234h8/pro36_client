import React, { useEffect, useState } from "react";
import { AccountInterface } from "../interface/AccountInterface";
import axios from "axios";
import datas from "../data/datas.json";
const DetailModal = ({ accountId, setIsDetailModalVisible }: any) => {
  const [exAccount, setExAccount] = useState<AccountInterface>();
  console.log(accountId);
  useEffect(() => {
    const getAccount = async () => {
      const res = await axios.get(`http://localhost:5000/account/${accountId}`);
      setExAccount(res.data.account);
    };
    getAccount();
  }, [accountId]);
  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-[100] outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        <div className="relative">
          <div className="absolute top-0 right-0">
            <i
              onClick={() => setIsDetailModalVisible(false)}
              className="fa-solid fa-xmark"
            ></i>
          </div>
          <div className="text-center p-5 flex-auto justify-center">
            <h2 className="text-xl font-bold py-4 ">Details</h2>
            <p className="text-sm text-gray-500 px-8"></p>
          </div>
          <div className="flex items-center ">
            <div className="w-2/4 flex  gap-2 flex-col px-8">
              {datas.account_detail_modal.map((data) => {
                return <div>{data.name}</div>;
              })}
            </div>
            <div className="w-2/4 flex  gap-2 flex-col">
              <div>{exAccount?.regist_date}</div>
              <div>{exAccount?.client_name}</div>
              <div>{exAccount?.account_no}</div>
              <div>{exAccount?.server}</div>
              <div>{exAccount?.expired_date}</div>
              <div>{exAccount?.ea_name}</div>
              <div>{exAccount?.remark}</div>
              <div>{exAccount?.vps}</div>
              <div>{exAccount?.recruit_by}</div>
            </div>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
