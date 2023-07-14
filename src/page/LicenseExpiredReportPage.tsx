import React, { SyntheticEvent, useEffect, useState } from "react";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";
import { AccountInterface } from "../interface/AccountInterface";
import datas from "../data/datas.json";
import autoTable from "jspdf-autotable";
import { BASE_URL, EDIT_MEMBER_PATH } from "../config/config";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";
import Datepicker from "react-tailwindcss-datepicker";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import SearchFromDateToEndDateModal from "../components/SearchFromDateToEndDateModal";
import NoResultsFound from "../components/NoResultsFound";
const LicenseExpiredReportPage = ({ user, avatar }: any) => {
  const widthStyle = useContainerWidthUtils();
  const [licenseExpiredAccounts, setLicenseExpiredAccounts] = useState<any>([]);
  const [licenseExpiredAccountsCount, setLicenseExpiredAccountsCount] =
    useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [startDateValue, setStartDateValue] = useState<any>({
    startDate: null,
    endDate: null,
  });
  const [endDateValue, setEndDateValue] = useState<any>({
    startDate: null,
    endDate: null,
  });
  const handleEndDateValueChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setEndDateValue(newValue);
  };
  const startedDateParts = startDateValue.startDate?.split("-");
  let startDate = "";
  if (startedDateParts !== undefined) {
    startDate = `${startedDateParts[2]}-${startedDateParts[1]}-${startedDateParts[0]}`;
  }
  console.log(startDate);
  const endDateParts = endDateValue.startDate?.split("-");
  let endDate = "";
  if (endDateParts !== undefined) {
    endDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;
  }
  console.log(endDate);
  const totalPages = Math.ceil(licenseExpiredAccountsCount / pageSize);
  console.log(licenseExpiredAccountsCount);
  console.log("totalPages : ", totalPages);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(true);

  const getPaginateData = async (newPage: number, newPageSize: number) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/license-expired-report?page=${newPage}&pageSize=${newPageSize}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );
      setLicenseExpiredAccounts(res.data.licenseExpiredAccounts);
      console.log(res.data);
      setPage(newPage);
    } catch (err) {
      console.log(err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const startY = 40; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed

    if (licenseExpiredAccounts && licenseExpiredAccounts.length > 0) {
      const rows = licenseExpiredAccounts.map(
        (account: AccountInterface, index: number) => [
          index + 1,
          account.id,
          account.account_no,
          account.expired_date,
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

      const tableConfig = {
        startY: startY,
        head: [tableHeaders],
        body: rows,
      };

      autoTable(doc, tableConfig);

      // Calculate the table height
      const tableHeight = tableData.length * rowHeight;
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Nb. Sort berdasarkan Expired Date",
        15,
        startY + tableHeight + 10
      );
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

      doc.text(
        "Nb. Sort berdasarkan Expired Date",
        15,
        startY + rowHeight + 10
      );
    }
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(`License Expired Report`, 15, 20);
    doc.setFontSize(10);
    doc.text(`From Date: [ ${startDate}] to [${endDate} ]`, 15, 30);

    doc.save(`LicenseExpiredReport_${startDate}_${endDate}.pdf`);
  };

  const previewPDF = () => {
    const doc = new jsPDF();
    const startY = 40; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed

    if (licenseExpiredAccounts && licenseExpiredAccounts.length > 0) {
      const rows = licenseExpiredAccounts.map(
        (account: AccountInterface, index: number) => [
          index + 1,
          account.id,
          account.account_no,
          account.expired_date,
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

      const tableConfig = {
        startY: startY,
        head: [tableHeaders],
        body: rows,
      };

      autoTable(doc, tableConfig);

      // Calculate the table height
      const tableHeight = tableData.length * rowHeight;
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Nb. Sort berdasarkan Expired Date",
        15,
        startY + tableHeight + 10
      );
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

      doc.text(
        "Nb. Sort berdasarkan Expired Date",
        15,
        startY + rowHeight + 10
      );
    }
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(`License Expired Report`, 15, 20);
    doc.setFontSize(10);
    doc.text(`From Date: [ ${startDate} ] to [ ${endDate} ]`, 15, 30);

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
      `${BASE_URL}/license-expired-report?startDate=${startDate}&endDate=${endDate}`
    );
    if (res.status === 200) {
      setShowSearchModal(false);
    }
    setLicenseExpiredAccountsCount(res.data.totalCount);
    setLicenseExpiredAccounts(res.data.licenseExpiredAccounts);
  };

  const handleValueChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setStartDateValue(newValue);
  };

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

      <Navbar user={user} avatar={avatar} />
      <Breadcrumb />
      <div className="w-full lg:mx-auto lg:px-24 ">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-4 lg:px-0">
            <h2 className="text-lg font-semibold leading-tight md:text-xl lg:text-2xl dark:text-white">
              License Expired Report
            </h2>
            <div className="flex items-center gap-2" onClick={previewPDF}>
              <button className="add-member-btn">
                <i className="fa-fa-solid add"></i>
                <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative text-xs">Preview</span>
                </a>
              </button>
              <button className="add-member-btn" onClick={generatePDF}>
                <i className="fa-fa-solid add"></i>
                <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative text-xs">Print</span>
                </a>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 lg:px-4 ">
            <div className="flex items-center gap-4">
              <div className="w-[300px]">From Date : </div>
              <Datepicker
                showShortcuts={true}
                primaryColor={"indigo"}
                asSingle={true}
                value={startDateValue}
                onChange={handleValueChange}
                displayFormat={"DD-MM-YYYY"}
              />
              <div>to</div>
              <Datepicker
                showShortcuts={true}
                primaryColor={"indigo"}
                asSingle={true}
                value={endDateValue}
                onChange={handleEndDateValueChange}
                displayFormat={"DD-MM-YYYY"}
              />
              <div
                className="cursor-pointer"
                onClick={getLicenseExpiredAccountsByStartDateAndEndDate}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-gray-500 fill-current"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col px-4 my-2 mt-10 sm:flex-row lg:px-0">
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
                  <option value="20">20</option>
                  <option value="40">40</option>
                  <option value="60">60</option>
                  <option value="80">80</option>
                  <option value="100">100</option>
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
                placeholder="Search"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm  md:text-base lg:text-lg placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none dark:text-white dark:bg-[#0e1011] dark:focus:bg-[#0e1011] dark:focus:text-white"
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    getPaginateData(1, pageSize);
                  }
                }}
              />
            </div>
          </div>

          {licenseExpiredAccounts?.length > 0 ? (
            <div
              className={`lg:w-full overflow-x-scroll px-4 md:px-8 lg:px-0  dark:bg-[#0e1011] `}
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
                            (data, index: number) => {
                              return (
                                <th
                                  key={index}
                                  className="text-center table__th dark:text-white "
                                >
                                  {data.name}
                                </th>
                              );
                            }
                          )}
                        </tr>
                      </thead>
                      <tbody className="table__tbody">
                        {licenseExpiredAccounts?.map(
                          (user: AccountInterface, index: number) => {
                            return (
                              <tr
                                key={index}
                                className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                              >
                                <td data-column="No" className="table-row__td">
                                  {index + 1}
                                </td>
                                <td
                                  data-column="Regist Date"
                                  className="table-row__td"
                                >
                                  <div className="table-row__info">
                                    <p className="table-row__name w-[100px] ">
                                      {user.id}
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
                                      {user.expired_date}
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
                <div className="flex items-center justify-center my-10">
                  <ul className="inline-flex space-x-2">
                    {page > 1 ? (
                      <li>
                        <button
                          onClick={() => {
                            getPaginateData(page - 1, pageSize);
                          }}
                          className="flex items-center justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"
                        >
                          <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                              fill-rule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                    ) : null}
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageIndex = index + 1;
                      return (
                        <li key={pageIndex}>
                          <button
                            onClick={() => {
                              getPaginateData(pageIndex, pageSize);
                            }}
                            className={`w-10 h-10 ${
                              page === index + 1
                                ? "bg-indigo-600 text-white"
                                : ""
                            } text-indigo-600  transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100`}
                          >
                            {index + 1}
                          </button>
                        </li>
                      );
                    })}

                    {page < totalPages ? (
                      <li>
                        <button
                          onClick={() => {
                            getPaginateData(page + 1, pageSize);
                          }}
                          className="flex items-center justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"
                        >
                          <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"
                              fill-rule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <NoResultsFound />
          )}
        </div>
      </div>
    </div>
  );
};
export default LicenseExpiredReportPage;
