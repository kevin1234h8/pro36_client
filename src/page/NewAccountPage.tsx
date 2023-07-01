import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import NewAccountTable from "../components/NewAccountTable";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import { AccountInterface } from "../interface/AccountInterface";
import "../scss/addbutton.css";
import "../scss/homepage.css";
const HomePage = ({
  setUser,
  isOpen,
  user,
  toggleNavigationSidebar,
  isLoggedIn,
  notificationCount,
  loginInfo,
  showToast,
  setShowToast,
  avatar,
}: any) => {
  const [account, setAccount] = useState<AccountInterface>();
  const [totalAccount, setTotalAccount] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    try {
      const getAccounts = async () => {
        const res = await axios.get(`${BASE_URL}/account`);
        setAccount(res.data.accounts);
        setTotalAccount(res.data.totalAccount);
        if (res.status === 200) {
          setIsLoading(false);
        }
      };
      getAccounts();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const showToasts = () => {
      setShowToast(localStorage.getItem("showToast"));

      if (showToast === "true") {
        toast.success("Login successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          localStorage.setItem("showToast", "false");
        }, 2000);
      }
    };
    return showToasts();
  }, [showToast]);

  const getPaginateData = async (newPage: number, newPageSize: number) => {
    try {
      let res = await axios.get(
        `${BASE_URL}/account?page=${newPage}&pageSize=${newPageSize}&search=${search}`
      );
      if (res.status === 200) {
        setIsLoading(false);
      }
      setAccount(res.data.accounts);
      setTotalAccount(res.data.totalAccount);
      setPage(newPage);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAccount = async (id: string) => {
    const values = {
      deleted_by: user.id,
    };

    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this account ?"
      );
      if (confirmed) {
        const res = await axios.put(`${BASE_URL}/account/delete/${id}`, values);
        if (res.status === 200) {
          setIsSuccessModalVisible(true);
        } else {
          setIsSuccessModalVisible(false);
        }
      }
    } catch (error) {
      setIsSuccessModalVisible(false);
    }
  };

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="relative bg-[#fafafa]   dark:bg-[#0e1011]">
      {showToast === "true" ? (
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={false}
          theme="light"
        />
      ) : null}
      {isSuccessModalVisible ? (
        <SuccessModal
          text={"Account Deleted Successfully"}
          redirectLink={"/new-account"}
        />
      ) : null}

      <div className="dark:bg-[#0e1011]">
        <Navbar user={user} avatar={avatar} />
        <div className="main">
          <div className={`main__content  pt-[32px] pb-[32px] w-full `}>
            <div className="member-list">
              <div className={`member-list-container`}></div>
            </div>
            <div className="lg:px-24">
              <NewAccountTable
                account={account}
                pageSize={pageSize}
                setPageSize={setPageSize}
                getPaginateData={getPaginateData}
                totalAccount={totalAccount}
                page={page}
                setPage={setPage}
                setIsSuccessModalVisible={setIsSuccessModalVisible}
                setSearch={setSearch}
                deleteAccount={deleteAccount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
