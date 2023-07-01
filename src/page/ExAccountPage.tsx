import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AccountInterface } from "../interface/AccountInterface";
import axios from "axios";
import ExAccountTable from "../components/ExAccountTable";
import SuccessModal from "../components/SuccessModal";
import Sidebar from "../components/Sidebar";
import { BASE_URL } from "../config/config";
import LoadingSpinner from "../components/LoadingSpinner";

const ExAccountPage = ({ isOpen, toggleNavigationSidebar, user }: any) => {
  const [exAccount, setExAccount] = useState<AccountInterface>();
  const [totalExAccount, setTotalExAccount] = useState<number>();
  const [exAccountPageSize, setExAccountPageSize] = useState<number>(20);
  const [exAccountPage, setExAccountPage] = useState<number>(1);
  const [exAccountSearch, setExAccountSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const getExAccount = async () => {
      const res = await axios.get(`${BASE_URL}/ex-account`);
      setExAccount(res.data.exAccounts);
      setTotalExAccount(res.data.totalAccount);
      if (res.status === 200) {
        setIsLoading(false);
      }
    };
    getExAccount();
  }, []);

  const getExAccountPaginateData = async (
    newPage: number,
    newPageSize: number
  ) => {
    const res = await axios.get(
      `${BASE_URL}/ex-account?page=${newPage}&pageSize=${newPageSize}&search=${exAccountSearch}`
    );
    if (res.status === 200) {
      setIsLoading(false);
    }
    setExAccount(res.data.exAccounts);
    setTotalExAccount(res.data.totalAccount);
    setExAccountPage(newPage);
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="relative bg-[#fafafa]  dark:bg-[#0e1011]">
      {/* {isSuccessModalVisible ? (
        <SuccessModal
          text={"Account Deleted Successfully"}
          redirectLink={"/"}
        />
      ) : null} */}
      <div>
        <Navbar user={user} />
        <div className="main">
          <div className={`main__content pt-[32px] pb-[32px] w-full `}>
            <div className="member-list">
              <div className={`member-list-container`}></div>
            </div>
            <div className="lg:px-24">
              <ExAccountTable
                user={user}
                exAccount={exAccount}
                exAccountPageSize={exAccountPageSize}
                setExAccountPageSize={setExAccountPageSize}
                getExAccountPaginateData={getExAccountPaginateData}
                totalExAccount={totalExAccount}
                exAccountPage={exAccountPage}
                setExAccountPage={setExAccountPage}
                setExAccountSearch={setExAccountSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExAccountPage;
