import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import Navbar from "../components/Navbar";
import autoTable from "jspdf-autotable";
import Breadcrumb from "../components/Breadcrumb";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";
import datas from "../data/datas.json";
import { AccountInterface } from "../interface/AccountInterface";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../config/config";
import { InputInvoiceSummary } from "../interface/InputInvoiceSummary";
import jsPDF from "jspdf";
import SearchFromDateToEndDateModal from "../components/SearchFromDateToEndDateModal";
import SearchClientReportFromDateToEndDateModal from "../components/SearchClientReportFromDateToEndDateModal";
import NoResultsFound from "../components/NoResultsFound";
const ClientReportPage = ({ user, avatar, parsedUserData }: any) => {
  const widthStyle = useContainerWidthUtils();
  const [ClientReportAccounts, setClientReportAccounts] = useState<any>([]);
  const [ClientReportAccountsCount, setClientReportAccountsCount] =
    useState<any>([]);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(true);
  const [clientName, setClientName] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(ClientReportAccountsCount / pageSize);
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const [startDateValue, setStartDateValue] = useState<any>({
    startDate: null || formattedDate,
    endDate: null,
  });
  const [endDateValue, setEndDateValue] = useState<any>({
    startDate: null || formattedDate,
    endDate: null,
  });
  // useEffect(() => {
  //   const getAccount = async() => {
  //     const res = await axios.get(`${BASE_URL}/account/${id}`);
  //   }
  // })
  const startedDateParts = startDateValue.startDate?.split("-");
  let startDate = "";
  if (startedDateParts !== undefined) {
    startDate = `${startedDateParts[2]}-${startedDateParts[1]}-${startedDateParts[0]}`;
  }
  const endDateParts = endDateValue.endDate?.split("-");
  let endDate = "";
  if (endDateParts !== undefined) {
    endDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;
  }

  const getPaginateData = async (newPage: number, newPageSize: number) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/client-report?page=${newPage}&pageSize=${newPageSize}&clientName=${clientName}&startDate=${startDate}&endDate=${endDate}`
      );
      setClientReportAccounts(res.data.licenseExpiredAccounts);
      setPage(newPage);
    } catch (err) {
      console.log(err);
    }
  };

  const getClientReportAccounts = async () => {
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
      `${BASE_URL}/client-report?startDate=${startDate}&endDate=${endDate}&clientName=${clientName}`,
      { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
    );
    setClientReportAccountsCount(res.data.totalCount);
    setClientReportAccounts(res.data.clientReportAccounts);
    setShowSearchModal(false);
  };

  const handleValueChange = (newValue: any) => {
    setStartDateValue(newValue);
  };

  const handleEndDateValueChange = (newValue: any) => {
    setEndDateValue(newValue);
  };
  const grandTotal = ClientReportAccounts.reduce(
    (total: any, user: any) => total + user.total_amount,
    0
  ).toLocaleString("id-ID");
  const generatePDF = () => {
    const doc = new jsPDF();
    const startY = 60; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed
    if (ClientReportAccounts && ClientReportAccounts.length > 0) {
      const rows = ClientReportAccounts.map(
        (account: InputInvoiceSummary, index: number) => [
          index + 1,
          account.date,
          account.no_invoice,
          "Rp " + account.total_amount.toLocaleString("id-ID"),
        ]
      );

      const tableHeaders = ["No", "Invoice Date", "No Invoice", "Total Amount"];
      const tableData = [tableHeaders, ...rows];

      const tableConfig = {
        startY: startY,
        head: [tableHeaders],
        body: rows,
      };

      const tableHeight = tableData.length * rowHeight;
      const city = ClientReportAccounts.find(
        (ClientReportAccount: any, index: number) => {
          return ClientReportAccount.city;
        }
      );

      doc.setFontSize(11);
      doc.text(`From Date : [ ${startDate} ] to [ ${endDate} ] `, 15, 30);
      doc.text(`Client Name`, 15, 40);
      doc.text(`:`, 40, 40);
      doc.text(clientName, 50, 40);
      doc.text(`City`, 15, 45);
      doc.text(`:`, 40, 45);
      doc.text(city.city, 50, 45);
      autoTable(doc, tableConfig);

      doc.text(
        `Grand Total P/L Rp ${grandTotal.toString()}`,
        75,
        startY + tableHeight + 20
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Client P/L Report`, 15, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Nb. Sort berdasarkan tanggal Invoice",
        15,
        startY + tableHeight + 30
      );
    } else {
      autoTable(doc, {
        startY: startY,
        head: [["No", "Invoice Date", "No Invoice", "Total Amount"]],
        body: [["No results found"]],
      });
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Nb. Sort berdasarkan tanggal Invoice",
        15,
        startY + rowHeight + 20
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Client P/L Report", 15, 20);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); //
      doc.text(`From Date : [  ] to [  ] `, 15, 30);
      doc.text(`Client Name`, 15, 40);
      doc.text(`:`, 40, 40);
      doc.text("", 50, 40);
      doc.text(`City`, 15, 45);
      doc.text(`:`, 40, 45);
      doc.text("", 50, 45);
    }

    doc.save(
      `${clientName}_Report_${startDateValue.startDate}_${endDateValue.endDate}.pdf`
    );
  };

  const previewPDF = () => {
    const doc = new jsPDF();
    const startY = 60; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed
    if (ClientReportAccounts && ClientReportAccounts.length > 0) {
      const rows = ClientReportAccounts.map(
        (account: InputInvoiceSummary, index: number) => [
          index + 1,
          account.date,
          account.no_invoice,
          "Rp " + account.total_amount.toLocaleString("id-ID"),
        ]
      );

      const tableHeaders = ["No", "Invoice Date", "No Invoice", "Total Amount"];
      const tableData = [tableHeaders, ...rows];

      const tableConfig = {
        startY: startY,
        head: [tableHeaders],
        body: rows,
      };

      const tableHeight = tableData.length * rowHeight;
      const city = ClientReportAccounts.find(
        (ClientReportAccount: any, index: number) => {
          return ClientReportAccount.city;
        }
      );

      doc.setFontSize(11);
      doc.text(`From Date : [ ${startDate} ] to [ ${endDate} ] `, 15, 30);
      doc.text(`Client Name`, 15, 40);
      doc.text(`:`, 40, 40);
      doc.text(clientName, 50, 40);
      doc.text(`City`, 15, 45);
      doc.text(`:`, 40, 45);
      doc.text(city.city, 50, 45);
      autoTable(doc, tableConfig);

      doc.text(
        `Grand Total P/L Rp ${grandTotal.toString()}`,
        75,
        startY + tableHeight + 20
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Client P/L Report`, 15, 20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Nb. Sort berdasarkan tanggal Invoice",
        15,
        startY + tableHeight + 30
      );
    } else {
      autoTable(doc, {
        startY: startY,
        head: [["No", "Invoice Date", "No Invoice", "Total Amount"]],
        body: [["No results found"]],
      });
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Nb. Sort berdasarkan tanggal Invoice",
        15,
        startY + rowHeight + 20
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Client P/L Report", 15, 20);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); //
      doc.text(`From Date : [  ] to [  ] `, 15, 30);
      doc.text(`Client Name`, 15, 40);
      doc.text(`:`, 40, 40);
      doc.text("", 50, 40);
      doc.text(`City`, 15, 45);
      doc.text(`:`, 40, 45);
      doc.text("", 50, 45);
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div>
      <ToastContainer />
      {showSearchModal ? (
        <SearchClientReportFromDateToEndDateModal
          startDateValue={startDateValue}
          endDateValue={endDateValue}
          handleValueChange={handleValueChange}
          handleEndDateValueChange={handleEndDateValueChange}
          getClientReportAccounts={getClientReportAccounts}
        />
      ) : null}

      <Navbar user={user} avatar={avatar} />
      <Breadcrumb />
      <div className="w-full h-screen lg:mx-auto dark:bg-[#0e1011] lg:px-24 ">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-0 md:px-8 lg:px-0">
            <h2 className="text-lg font-semibold leading-tight md:text-xl lg:text-2xl dark:text-white ">
              Client P/L Report
            </h2>
          </div>
          {/* <div className="flex flex-col px-4 my-2 sm:flex-row lg:px-0">
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
      </div> */}
          <div className="flex flex-col justify-between gap-6 px-0 md:px-8 md:flex-row md:items-center lg:px-0 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-4 md:flex-row md:items-center lg:flex-row lg:items-center md:gap-10 lg:gap-10">
              <div className="w-auto dark:text-[#e4e4e4] md:w-24 lg:w-24">
                Client's Name:
              </div>
              <div>
                <input
                  type="text"
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500/20"
                  placeholder="Search Client's Name"
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
            </div>
            <div className="hidden gap-4 item-center md:flex lg:flex">
              <button
                className="add-member-btn"
                onClick={getClientReportAccounts}
              >
                <i className="fa-fa-solid add"></i>
                <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                  <span className="relative text-xs">Search</span>
                </a>
              </button>
              <div>
                <div className="flex items-center gap-2">
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
            </div>
          </div>
          <div className="flex items-center justify-between px-0 my-4 md:px-8 lg:px-0">
            <div className="flex flex-col w-full gap-4 md:items-center lg:items-center md:flex-row lg:flex-row">
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

              <div className="dark:text-white text-start">to</div>
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

              {/* <div
                className="cursor-pointer"
                onClick={getLicenseExpiredAccountsByStartDateAndEndDate}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-gray-500 fill-current"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </div> */}
            </div>
          </div>
          <div className="flex gap-4 px-0 mt-10 item-center md:hidden lg:hidden">
            <button
              className="add-member-btn"
              onClick={getClientReportAccounts}
            >
              <i className="fa-fa-solid add"></i>
              <a className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                <span className="relative text-xs">Search</span>
              </a>
            </button>
            <div>
              <div className="flex items-center gap-2">
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
          </div>

          {/* <div className="flex items-center gap-16">
            <div className="w-24">Client's Name:</div>
            <div>
              <input
                type="text"
                className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500/20"
                placeholder="Search Client's Name"
              />
            </div>
          </div>
          <div className="flex items-center gap-16">
            <div className="w-24">City:</div>
            <div>
              <input
                type="text"
                className="relative   transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-indigo-500/20"
                placeholder="Search City"
              />
            </div>
          </div> */}

          {ClientReportAccounts?.length > 0 ? (
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
                          {datas.clientReport.map((data, index: number) => {
                            return (
                              <th
                                key={index}
                                className="text-center table__th dark:text-white "
                              >
                                {data.name}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="table__tbody">
                        {ClientReportAccounts?.map(
                          (user: InputInvoiceSummary, index: number) => {
                            return (
                              <tr
                                key={index}
                                className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                              >
                                <td data-column="No" className="table-row__td">
                                  {index + 1}
                                </td>

                                <td
                                  data-column="Client Name"
                                  className="table-row__td "
                                >
                                  <div className="table-row__info  w-[75px]">
                                    <p className="table-row text-center w-[75px]">
                                      {user.date}
                                    </p>
                                  </div>
                                </td>
                                <td
                                  data-column="Client Name"
                                  className="table-row__td "
                                >
                                  <div className="table-row__info">
                                    <p className="table-row text-center">
                                      {user.no_invoice}
                                    </p>
                                  </div>
                                </td>
                                <td
                                  data-column="Server"
                                  className="table-row__td"
                                >
                                  <p className="table-row__info w-[100px]">
                                    Rp{" "}
                                    {(user.total_amount / 1000).toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits: 3,
                                        maximumFractionDigits: 3,
                                      }
                                    )}
                                  </p>
                                </td>
                              </tr>
                            );
                          }
                        )}
                        <tr>
                          <td data-column="Server" className="table-row__td">
                            <strong className="dark:text-blue-500">
                              Grand Total P/L
                            </strong>
                          </td>
                          <td></td>
                          <td></td>
                          <td data-column="Server" className="table-row__td">
                            <strong className="dark:text-blue-500">
                              Rp{" "}
                              {(
                                ClientReportAccounts.reduce(
                                  (total: any, user: any) =>
                                    total + user.total_amount,
                                  0
                                ) / 1000
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                              })}
                            </strong>
                          </td>
                        </tr>
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

export default ClientReportPage;
