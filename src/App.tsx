import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewAccountPage from "./page/NewAccountPage";
import AddMember from "./page/AddMember";
import ExAccountPage from "./page/ExAccountPage";
import AddUser from "./page/AddUser";
import EditMemberPage from "./page/EditAccountPage";
import LoginPage from "./page/LoginPage";
import { User } from "./interface/UserInterface";
import UnAuthorizedPage from "./page/UnAuthorizedPage";
import AccountDetailsPage from "./page/AccountDetailsPage";
import AddInputInvoicePage from "./page/AddInputInvoicePage";
import InputInvoicePage from "./page/InputInvoicePage";
import MainPage from "./page/MainPage";
import axios from "axios";
import InvoiceSummaryDetails from "./page/InvoiceSummaryDetails";
import EditInvoiceSummaryPage from "./page/EditInvoiceSummaryPage";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [user, setUser] = useState<User>();
  const [loginInfo, setLoginInfo] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<any>();
  const [avatar, setAvatar] = useState<any>();
  const currentDate = new Date();
  const apiKey = "38a4000d2421d3f8cf6b913c32d87aeb";
  const formattedDate = currentDate.toISOString().split("T")[0];
  const [loading, setLoading] = useState(true); // Add a loading state
  useEffect(() => {
    const getLoginUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        console.log(res.data);
        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getLoginUser();
  }, []);
  useEffect(() => {
    const getAvatar = async () => {
      const res = await axios.get(`http://localhost:5000/avatar/${user?.id}`);
      setAvatar(res.data.avatar);
    };
    getAvatar();
  }, []);

  useEffect(() => {
    const getExchangeRate = async () => {
      const response = await axios.get(
        `http://api.exchangeratesapi.io/${formattedDate}?base=USD&access_key=${apiKey}`
      );
    };
    getExchangeRate();
  }, []);

  const toggleNavigationSidebar = () => {
    setIsOpen(!isOpen);
  };
  const [notificationCount, setNotificationCount] = useState(
    localStorage.getItem("notificationCount")
  );

  useEffect(() => {
    const storedUser = getCookie("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const isLogin = getCookie("isLogin");
    if (isLogin) {
      const login = JSON.parse(isLogin);
      setIsLoggedIn(login);
    }
  }, []);

  useEffect(() => {
    const loginInfo = getCookie("loginInfo");
    if (loginInfo) {
      const login = JSON.parse(loginInfo);
      setLoginInfo(login);
    }
  }, []);

  function onWindowMatch() {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  onWindowMatch();
  // Whenever the user explicitly chooses light mode

  // Whenever the user explicitly chooses to respect the OS preference
  const getCookie = (name: string) => {
    const cookieName = name + "=";
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="dark:bg-[#0e1011]">
      <Router>
        <Routes>
          <Route
            path="/new-account"
            element={
              user != undefined && (user?.level === 1 || user?.level === 2) ? (
                <NewAccountPage
                  notificationCount={notificationCount}
                  isOpen={isOpen}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  toggleNavigationSidebar={toggleNavigationSidebar}
                  loginInfo={loginInfo}
                  setShowToast={setShowToast}
                  showToast={showToast}
                  avatar={avatar}
                />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route
            path="/add-member"
            element={
              <AddMember
                notificationCount={notificationCount}
                setNotificationCount={setNotificationCount}
                user={user}
              />
            }
          />
          <Route
            path="/ex-account"
            element={
              user != undefined && (user?.level === 1 || user?.level === 2) ? (
                <ExAccountPage
                  isOpen={isOpen}
                  user={user}
                  isLoggedIn={isLoggedIn}
                  toggleNavigationSidebar={toggleNavigationSidebar}
                  avatar={avatar}
                />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route
            path="/input-invoice"
            element={
              user != undefined ? (
                <InputInvoicePage user={user} avatar={avatar} />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route
            path="/add-user"
            element={
              user != undefined && user?.level === 1 ? (
                <AddUser user={user} avatar={avatar} />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route
            path="/edit-account/:id"
            element={
              user != undefined && (user?.level === 1 || user?.level === 2) ? (
                <EditMemberPage user={user} />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                setUser={setUser}
                setLoginInfo={setLoginInfo}
                setShowToast={setShowToast}
              />
            }
          />
          <Route
            path="/unauthorized"
            element={<UnAuthorizedPage user={user} />}
          />
          <Route
            path="/account-details/:id"
            element={
              user != undefined && (user?.level === 1 || user?.level === 2) ? (
                <AccountDetailsPage user={user} />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route
            path="/input-invoice-details/:id"
            element={
              user != undefined ? (
                <InvoiceSummaryDetails user={user} />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route
            path="/edit-input-invoice/:id"
            element={
              user != undefined ? (
                <EditInvoiceSummaryPage user={user} />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route
            path="/add-invoice"
            element={
              user != undefined ? (
                <AddInputInvoicePage user={user} />
              ) : (
                <UnAuthorizedPage user={user} />
              )
            }
          />
          <Route path="/" element={<MainPage user={user} avatar={avatar} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
