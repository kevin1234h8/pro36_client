import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import transparentLoader from "../assets/transparentLoader.gif";
import Breadcrumb from "../components/Breadcrumb";
import Navbar from "../components/Navbar";
import NoResultsFound from "../components/NoResultsFound";
import SearchFromDateToEndDateModal from "../components/SearchFromDateToEndDateModal";
import { BASE_URL } from "../config/config";
import datas from "../data/datas.json";
import { AccountInterface } from "../interface/AccountInterface";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";
import {
  changeDateFormatAndIncrementHour,
  changeDateFormatAndNotIncrementHourWithAddedDate,
  getFormattedDate,
  getIndonesianFormattedDate,
} from "../utils/dateUtils";
import ReactPaginate from "react-paginate";

const LicenseExpiredReportPage = ({ user, avatar, parsedUserData }: any) => {
  const widthStyle = useContainerWidthUtils();
  const [licenseExpiredAccounts, setLicenseExpiredAccounts] = useState<any>([]);

  const [licenseExpiredAccountsCount, setLicenseExpiredAccountsCount] =
    useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(100);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [recruiter, setRecruiter] = useState<string>("");
  const [startDateValue, setStartDateValue] = useState<any>({
    startDate: null,
    endDate: null,
  });
  const [endDateValue, setEndDateValue] = useState<any>({
    startDate: null,
    endDate: null,
  });
  const [loadingLicenceReport, setLoadingLicenceReport] = useState(false);
  const handleEndDateValueChange = (newValue: any) => {
    setEndDateValue(newValue);
  };
  const startedDateParts = startDateValue.startDate?.split("-");
  let startDate = "";
  if (startedDateParts !== undefined) {
    startDate = `${startedDateParts[2]}-${startedDateParts[1]}-${startedDateParts[0]}`;
  }
  const endDateParts = endDateValue.startDate?.split("-");
  let endDate = "";
  if (endDateParts !== undefined) {
    endDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;
  }
  const totalPages = Math.ceil(licenseExpiredAccountsCount / pageSize);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(true);

  const getPaginateData = async (newPage: number, newPageSize: number) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/license-expired-report?page=${newPage}&pageSize=${newPageSize}&search=${search}&startDate=${startDateValue.startDate}&endDate=${endDateValue.endDate}&recruiter=${recruiter}`,
        { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
      );
      setLicenseExpiredAccounts(res.data.licenseExpiredAccounts);
      setPage(newPage);
    } catch (err) {
      console.log(err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const startY = 40; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed
    let isFirstPage = true;
    if (licenseExpiredAccounts && licenseExpiredAccounts.length > 0) {
      const rows = licenseExpiredAccounts.map(
        (account: AccountInterface, index: number) => [
          index + 1,
          account.client_name,
          account.account_no,
          changeDateFormatAndNotIncrementHourWithAddedDate(
            account.expired_date
          ),
          account.recruit_by,
          account.vps,
          account.ea_name,
        ]
      );

      const tableHeaders = [
        "No",
        "User ID",
        "Account No",
        "Expired Date",
        "Recruit By",
        "VPS",
        "Bot Name",
      ];

      const tableData = [tableHeaders, ...rows];
      const drawPageTitle = (title: any) => {
        if (isFirstPage) {
          doc.setFontSize(16);
          doc.setFont("helvetica", "normal");
          doc.text(`License Expired Report`, 15, 20);
          doc.setFontSize(10);
          doc.text(`Recruiter: [ ${recruiter} ]`, 15, 30);
          doc.text(`From Date: [ ${startDate}] to [ ${endDate} ]`, 15, 35);

          isFirstPage = false; // Set the flag to false after drawing the title
        }
      };
      const tableConfig = {
        startY: startY,
        head: [tableHeaders],
        body: rows,
        didDrawPage: (data: any) => {
          // Call the function to draw the title on each page
          drawPageTitle("Client P/L Report");
        },
      };

      autoTable(doc, tableConfig);

      // Calculate the table height
      const tableHeight = tableData.length * rowHeight;
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      // doc.text(
      //   "Nb. Sort berdasarkan Expired Date",
      //   15,
      //   startY + tableHeight + 10
      // );
    } else {
      autoTable(doc, {
        startY: startY,
        head: [
          [
            "No",
            "User ID",
            "Account No",
            "Expired Date",
            "Recruit By",
            "VPS",
            "Bot Name",
          ],
        ],
        body: [["No results found"]],
      });
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");

      // doc.text(
      //   "Nb. Sort berdasarkan Expired Date",
      //   15,
      //   startY + rowHeight + 10
      // );
    }

    doc.save(`LicenseExpiredReport_${startDate}_${endDate}.pdf`);
  };

  const previewPDF = () => {
    const doc = new jsPDF();
    const startY = 40; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed
    let isFirstPage = true;
    if (licenseExpiredAccounts && licenseExpiredAccounts.length > 0) {
      const rows = licenseExpiredAccounts.map(
        (account: AccountInterface, index: number) => [
          index + 1,
          account.client_name,
          account.account_no,
          changeDateFormatAndNotIncrementHourWithAddedDate(
            account.expired_date
          ),
          account.recruit_by,
          account.vps,
          account.ea_name,
        ]
      );

      const tableHeaders = [
        "No",
        "User ID",
        "Account No",
        "Expired Date",
        "Recruit By",
        "VPS",
        "Bot Name",
      ];

      const tableData = [tableHeaders, ...rows];
      const drawPageTitle = (title: any) => {
        if (isFirstPage) {
          doc.setFontSize(16);
          doc.setFont("helvetica", "normal");
          doc.text(`License Expired Report`, 15, 20);
          doc.setFontSize(10);
          doc.text(`Recruiter: [ ${recruiter} ]`, 15, 30);
          doc.text(`From Date: [ ${startDate}] to [ ${endDate} ]`, 15, 35);

          isFirstPage = false; // Set the flag to false after drawing the title
        }
      };
      const tableConfig = {
        startY: startY,
        head: [tableHeaders],
        body: rows,
        didDrawPage: (data: any) => {
          // Call the function to draw the title on each page
          drawPageTitle("Client P/L Report");
        },
      };

      autoTable(doc, tableConfig);

      // Calculate the table height
      const tableHeight = tableData.length * rowHeight;
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      // doc.text(
      //   "Nb. Sort berdasarkan Expired Date",
      //   15,
      //   startY + tableHeight + 10
      // );
    } else {
      autoTable(doc, {
        startY: startY,
        head: [
          [
            "No",
            "User ID",
            "Account No",
            "Expired Date",
            "Recruit By",
            "VPS",
            "Bot Name",
          ],
        ],
        body: [["No results found"]],
      });
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");

      // doc.text(
      //   "Nb. Sort berdasarkan Expired Date",
      //   15,
      //   startY + rowHeight + 10
      // );
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  // useEffect(() => {
  //   const getLicenseExpiredAccounts = async () => {
  //     const res = await axios.get(`${BASE_URL}/license-expired-report`);
  //     setLicenseExpiredAccounts(res.data.licenseExpiredAccounts);
  //   };
  //   getLicenseExpiredAccounts();
  // }, []);

  const getLicenseExpiredAccountsByStartDateAndEndDate = async () => {
    setLoadingLicenceReport(true);
    if (startDateValue.startDate > endDateValue.endDate) {
      toast.error("Start date cannot be greater than end date", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (startDateValue.startDate === null || endDateValue.endDate === null) {
      toast.error("Please fill in both the start date and end date fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    const res = await axios.get(
      `${BASE_URL}/license-expired-report?startDate=${startDateValue.startDate}&endDate=${endDateValue.endDate}&search=${search}&recruiter=${recruiter}`,
      { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
    );
    if (res.status === 200) {
      setLoadingLicenceReport(false);
      setShowSearchModal(false);
    }
    setLicenseExpiredAccountsCount(res.data.totalCount);
    setLicenseExpiredAccounts(res.data.licenseExpiredAccounts);
  };

  const handleValueChange = (newValue: any) => {
    setStartDateValue(newValue);
  };

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const handleSort = (columnName: any) => {
    // If the clicked column is the current sort column, toggle the sort direction
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If the clicked column is a different column, set it as the new sort column
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const sortedAccount = [...licenseExpiredAccounts].sort((a, b) => {
    if (sortColumn === "No") {
      return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
    } else if (sortColumn === "User ID") {
      const userIdA = a.id;
      const userIdB = b.id;

      if (userIdA < userIdB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (userIdA > userIdB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Account No") {
      const accountNoA = a.account_no;
      const accountNoB = b.account_no;
      if (accountNoA < accountNoB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (accountNoA > accountNoB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Expired Date") {
      const dateA = a.expired_date;
      const dateB = b.expired_date;

      if (dateA < dateB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (dateA > dateB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Recruit By") {
      const recruitByA = a.recruit_by.toUpperCase();
      const recruitByB = b.recruit_by.toUpperCase();
      if (recruitByA < recruitByB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (recruitByA > recruitByB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "VPS") {
      const VPSA = a.vps?.toUpperCase();
      const VPSB = b.vps?.toUpperCase();
      if (VPSA < VPSB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (VPSA > VPSB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Bot Name") {
      const remarkA = a.ea_name.toUpperCase();
      const remarkB = b.ea_name.toUpperCase();
      if (remarkA < remarkB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (remarkA > remarkB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  let customPageNumber = 0;
  const handlePageClick = (event: any) => {
    customPageNumber = event.selected + 1;
    getPaginateData(event.selected + 1, pageSize);
  };
  const firstItemIndex = (page - 1) * pageSize + 1;
  const lastItemIndex = Math.min(
    firstItemIndex + pageSize - 1,
    licenseExpiredAccountsCount
  );

  return (
    <div>
      <ToastContainer />
      {showSearchModal ? (
        <SearchFromDateToEndDateModal
          startDateValue={startDateValue}
          endDateValue={endDateValue}
          handleValueChange={handleValueChange}
          handleEndDateValueChange={handleEndDateValueChange}
          getLicenseExpiredAccountsByStartDateAndEndDate={
            getLicenseExpiredAccountsByStartDateAndEndDate
          }
        />
      ) : null}

      <Navbar user={user} avatar={avatar} parsedUserData={parsedUserData} />
      <Breadcrumb />
      <div className="w-full dark:bg-[#0e1011] lg:mx-auto lg:px-24 ">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-0 md:px-8 lg:px-0">
            <h2 className="text-lg font-semibold leading-tight md:text-xl lg:text-2xl dark:text-white">
              License Expired Report
            </h2>
            <div className="items-center hidden gap-2 md:flex lg:flex">
              <button
                className="add-member-btn"
                onClick={getLicenseExpiredAccountsByStartDateAndEndDate}
              >
                <i className="fa-fa-solid add"></i>
                <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                  <span className="relative text-xs">Search</span>
                </a>
              </button>
              <button className="add-member-btn" onClick={previewPDF}>
                <i className="fa-fa-solid add"></i>
                <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                  <span className="relative text-xs">Preview</span>
                </a>
              </button>
              <button className="add-member-btn" onClick={generatePDF}>
                <i className="fa-fa-solid add"></i>
                <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                  <span className="relative text-xs">Print</span>
                </a>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-0 md:px-8 lg:px-0 md:flex-row md:items-center lg:flex-row lg:items-center md:gap-10 lg:gap-10">
            <div className="w-auto dark:text-[#e4e4e4] md:w-24 lg:w-24">
              Recruiter:
            </div>
            <div>
              <input
                type="text"
                className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500/20"
                placeholder="Search Recruiter"
                onChange={(e) => setRecruiter(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    getLicenseExpiredAccountsByStartDateAndEndDate();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-full px-0 mt-4 md:px-8 lg:px-0 ">
            <div
              className={`flex flex-col gap-4 md:flex-row lg:flex-row md:items-center lg:items-center w-full`}
            >
              <div className="w-[300px] px-0 dark:text-white lg:px-0 md:px-0 md:w-[120px] lg:w-[120px]">
                From Date :{" "}
              </div>
              {widthStyle < "600px" ? (
                <div className={`w-[${widthStyle}] md:w-auto`}>
                  <Datepicker
                    showShortcuts={true}
                    primaryColor={"indigo"}
                    asSingle={true}
                    value={startDateValue}
                    onChange={handleValueChange}
                    displayFormat={"DD-MM-YYYY"}
                  />
                </div>
              ) : (
                <div>
                  <Datepicker
                    showShortcuts={true}
                    primaryColor={"indigo"}
                    asSingle={true}
                    value={startDateValue}
                    onChange={handleValueChange}
                    displayFormat={"DD-MM-YYYY"}
                  />
                </div>
              )}

              <div className="px-0 dark:text-white lg:px-0 md:px-0">to</div>
              {widthStyle < "600px" ? (
                <div className={`w-[${widthStyle}] md:w-auto`}>
                  <Datepicker
                    showShortcuts={true}
                    primaryColor={"indigo"}
                    asSingle={true}
                    value={endDateValue}
                    onChange={handleEndDateValueChange}
                    displayFormat={"DD-MM-YYYY"}
                  />
                </div>
              ) : (
                <div>
                  <Datepicker
                    showShortcuts={true}
                    primaryColor={"indigo"}
                    asSingle={true}
                    value={endDateValue}
                    onChange={handleEndDateValueChange}
                    displayFormat={"DD-MM-YYYY"}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 px-0 mt-10 md:hidden lg:hidden ">
            <button
              className="add-member-btn"
              onClick={getLicenseExpiredAccountsByStartDateAndEndDate}
            >
              <i className="fa-fa-solid add"></i>
              <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                <span className="relative text-xs">Search</span>
              </a>
            </button>
            <button className="add-member-btn" onClick={previewPDF}>
              <i className="fa-fa-solid add"></i>
              <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                <span className="relative text-xs">Preview</span>
              </a>
            </button>
            <button className="add-member-btn" onClick={generatePDF}>
              <i className="fa-fa-solid add"></i>
              <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                <span className="relative text-xs">Print</span>
              </a>
            </button>
          </div>
          <div className="flex flex-col px-0 my-2 mt-10 sm:flex-row md:px-8 lg:px-0">
            <div className="flex flex-row mb-1 sm:mb-0">
              <div className="relative">
                <select
                  className="appearance-none h-full rounded-l text-sm border block md:text-base lg:text-lg w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-[#0e1011] dark:focus:bg-[#0e1011] dark:focus:text-white dark:text-white"
                  onChange={(e) => {
                    const selectedPageSize = parseInt(e.target.value);
                    setPageSize(parseInt(e.target.value));

                    getPaginateData(1, selectedPageSize);
                  }}
                >
                  <option
                    value="100"
                    className="text-[6px] md:text-[6px] lg:text-[12px]"
                  >
                    100
                  </option>
                  <option
                    value="500"
                    className="text-[6px] md:text-[6px] lg:text-[12px]"
                  >
                    500
                  </option>
                  <option
                    value="1000"
                    className="text-[6px] md:text-[6px] lg:text-[12px]"
                  >
                    1000
                  </option>
                  <option
                    value="2500"
                    className="text-[6px] md:text-[6px] lg:text-[12px]"
                  >
                    2500
                  </option>
                  <option
                    value="5000"
                    className="text-[6px] md:text-[6px] lg:text-[12px]"
                  >
                    5000
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="relative block">
              <span className="absolute inset-y-0 left-0 flex items-center h-full pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-gray-500 fill-current"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </span>
              <input
                placeholder="Search Account No"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm  md:text-base lg:text-lg placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none dark:text-white dark:bg-[#0e1011] dark:focus:bg-[#0e1011] dark:focus:text-white"
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    getLicenseExpiredAccountsByStartDateAndEndDate();
                  }
                }}
              />
            </div>
          </div>
          {loadingLicenceReport ? (
            <div className="flex items-center justify-center w-full ">
              <img
                className="flex items-center w-20 h-20"
                src={transparentLoader}
                alt=""
              />
            </div>
          ) : (
            <div>
              {licenseExpiredAccounts?.length > 0 ? (
                <div
                  className={`lg:w-full overflow-x-scroll md:overflow-x-hidden lg:overflow-x-hidden px-4 md:px-8 lg:px-0  dark:bg-[#0e1011] `}
                  style={{ width: widthStyle }}
                >
                  <div className="row row--top-40"></div>
                  <div className="row row--top-20">
                    <div className="col-md-12">
                      <div className="table-container  dark:bg-[#0e1011]">
                        <table className="table">
                          <thead className="table__thead dark:bg-[#0e1011] dark:text-white">
                            <tr>
                              {datas.licenseExpiredAccounts.map(
                                (data, index) => {
                                  const columnName = data.name;
                                  const isSortableColumn =
                                    columnName !== "No" &&
                                    columnName !== "Action";
                                  const isSortedColumn =
                                    sortColumn === columnName;
                                  const sortClass = isSortedColumn
                                    ? sortDirection === "asc"
                                      ? "fa-solid fa-sort-down"
                                      : "fa-solid fa-sort-up"
                                    : "";

                                  return (
                                    <th
                                      key={index}
                                      className={`text-center table__th  ${
                                        columnName === "Account No"
                                          ? "w-[100px]"
                                          : ""
                                      }  dark:text-white ${
                                        !isSortableColumn
                                          ? "cursor-default"
                                          : "cursor-pointer"
                                      }`}
                                      onClick={() => {
                                        if (isSortableColumn) {
                                          handleSort(columnName);
                                        }
                                      }}
                                    >
                                      {data.name}
                                      {isSortableColumn && isSortedColumn && (
                                        <i className={`fa ${sortClass} `}></i>
                                      )}
                                    </th>
                                  );
                                }
                              )}
                            </tr>
                          </thead>
                          <tbody className="table__tbody">
                            {sortedAccount?.map(
                              (user: AccountInterface, index: number) => {
                                return (
                                  <tr
                                    key={index}
                                    className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                                  >
                                    <td
                                      data-column="No"
                                      className="table-row__td"
                                    >
                                      {index + 1}
                                    </td>
                                    <td
                                      data-column="Regist Date"
                                      className="table-row__td"
                                    >
                                      <div className="table-row__info">
                                        <p className="table-row__name w-[100px] ">
                                          {user.client_name}
                                        </p>
                                      </div>
                                    </td>

                                    <td
                                      data-column="Client Name"
                                      className="table-row__td "
                                    >
                                      <div className="table-row__info">
                                        <p className="table-row text-center">
                                          {user.account_no}
                                        </p>
                                      </div>
                                    </td>
                                    <td
                                      data-column="Client Name"
                                      className="table-row__td "
                                    >
                                      <div className="table-row__info">
                                        <p className="table-row text-center">
                                          {changeDateFormatAndNotIncrementHourWithAddedDate(
                                            user.expired_date
                                          )}
                                        </p>
                                      </div>
                                    </td>
                                    <td
                                      data-column="Server"
                                      className="table-row__td"
                                    >
                                      <p className="table-row__info ">
                                        {user.recruit_by}
                                      </p>
                                    </td>
                                    <td
                                      data-column="Expired Date"
                                      className="table-row__td "
                                    >
                                      <p className="table-row__info w-[100px] ">
                                        {user.vps}
                                      </p>
                                    </td>
                                    <td
                                      data-column="EA Name"
                                      className="table-row__td"
                                    >
                                      <p className="table-row__info ">
                                        {user.ea_name}
                                      </p>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="flex items-center justify-between my-10 ">
                      <div></div>
                      <ul className="inline-flex space-x-2">
                        <ReactPaginate
                          breakLabel="..."
                          nextLabel=">"
                          onPageChange={handlePageClick}
                          pageRangeDisplayed={5}
                          pageCount={totalPages}
                          previousLabel="<"
                          breakLinkClassName={"text-indigo-600"}
                          previousClassName={
                            "flex items-center text-3xl justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"
                          }
                          previousLinkClassName={"text-indigo-600 "}
                          nextClassName={
                            "flex items-center text-3xl justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"
                          }
                          nextLinkClassName={"text-indigo-600"}
                          containerClassName="flex items-center gap-4"
                          breakClassName="flex items-center justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"
                          renderOnZeroPageCount={null}
                          pageClassName={` flex items-center justify-center  w-10 h-10   transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100`}
                          pageLinkClassName={
                            " flex items-center justify-center w-10 h-10 text-indigo-600  transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"
                          }
                          activeLinkClassName="bg-indigo-600 text-white"
                        />
                      </ul>
                      <div className="text-indigo-600">
                        Showing {firstItemIndex} - {lastItemIndex} of{" "}
                        {licenseExpiredAccountsCount} Licence Account(s)
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NoResultsFound />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default LicenseExpiredReportPage;
