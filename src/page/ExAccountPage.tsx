import axios from "axios";
import { useEffect, useState } from "react";
import ExAccountTable from "../components/ExAccountTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config/config";
import { AccountInterface } from "../interface/AccountInterface";
import Breadcrumb from "../components/Breadcrumb";

const ExAccountPage = ({ user, parsedUserData }: any) => {
  const [exAccount, setExAccount] = useState<AccountInterface>();
  const [totalExAccount, setTotalExAccount] = useState<number>();
  const [exAccountPageSize, setExAccountPageSize] = useState<number>(20);
  const [exAccountPage, setExAccountPage] = useState<number>(1);
  const [exAccountSearch, setExAccountSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getExAccount = async () => {
      const res = await axios.get(`${BASE_URL}/ex-account`, {
        headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
      });
      if (res.status === 200) {
        setIsLoading(false);
        setExAccount(res.data.exAccounts);
        setTotalExAccount(res.data.totalAccount);
      }
    };
    getExAccount();
  }, []);

  const getExAccountPaginateData = async (
    newPage: number,
    newPageSize: number
  ) => {
    const res = await axios.get(
      `${BASE_URL}/ex-account?page=${newPage}&pageSize=${newPageSize}&search=${exAccountSearch}`,
      { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
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
      <div>
        <Navbar user={user} parsedUserData={parsedUserData} />
        <Breadcrumb />
        <div className="main">
          <div className={`main__content pt-[32px] pb-[32px] w-full h-screen`}>
            <div className="member-list">
              <div className={`member-list-container`}></div>
            </div>
            <div className="lg:px-24  dark:bg-[#0e1011]">
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
                parsedUserData={parsedUserData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExAccountPage;
