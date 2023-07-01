import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import datas from "../data/datas.json";
import useLoading from "../hooks/useLoading";
import { InputInvoiceSummary } from "../interface/InputInvoiceSummary";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";
const InputInvoicePage = ({ user }: any) => {
  const widthStyle = useContainerWidthUtils();
  const [inputDetails, setInputDetails] = useState<InputInvoiceSummary[]>([]);
  const [totalInvoiceSummary, setTotalInvoiceSummary] = useState<number>(1);
  const [invoiceSummaryPage, setInvoiceSummaryPage] = useState<any>();
  const [searchInvoiceSummary, setSearchInvoiceSummary] = useState<string>("");
  const [invoiceSummaryPageSize, setInvoiceSummaryPageSize] =
    useState<number>(20);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useLoading();
  const totalPages = Math.ceil(totalInvoiceSummary / invoiceSummaryPageSize);

  useEffect(() => {
    const getInputInvoiceDetails = async () => {
      let res = await axios.get(
        `${BASE_URL}/input-invoice/input-invoice-summary?owner=${user.id}`
      );
      if (user.level === 1) {
        res = await axios.get(
          `${BASE_URL}/input-invoice/input-invoice-summary`
        );
      }
      if (res.status === 200) {
        setIsLoading(false);
      }
      setInputDetails(res.data.inputInvoiceSummary);
      setTotalInvoiceSummary(res.data.totalInvoiceSummary);
    };

    getInputInvoiceDetails();
  }, []);

  const getInvoiceSummaryPaginateData = async (
    newPage: number,
    newPageSize: number
  ) => {
    let res = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-summary?page=${newPage}&pageSize=${newPageSize}&search=${searchInvoiceSummary}&owner=${user.id}`
    );
    if (user.level === 1) {
      res = await axios.get(
        `${BASE_URL}/input-invoice/input-invoice-summary?page=${newPage}&pageSize=${newPageSize}&search=${searchInvoiceSummary}`
      );
    }
    if (res.status === 200) {
      setIsLoading(false);
    }
    console.log(res.data.inputInvoiceSummary);
    setInputDetails(res.data.inputInvoiceSummary);
    setTotalInvoiceSummary(res.data.totalInvoiceSummary);
    setInvoiceSummaryPage(newPage);
  };

  const deleteInvoiceSummary = async (id: string) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this invoice ?"
      );
      if (confirmed) {
        const res = await axios.delete(
          `${BASE_URL}/input-invoice/input-invoice-summary/${id}`
        );
        console.log(res);
        if (res.status === 200) {
          setIsSuccessModalVisible(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      {isSuccessModalVisible ? (
        <SuccessModal
          text={"invoice deleted successfully"}
          redirectLink={"/input-invoice"}
        />
      ) : null}
      <Navbar user={user} />
      <div className="w-full lg:mx-auto ">
        <div className="mx-auto max-w-7xl lg:px-24 ">
          <div className="flex items-center justify-between px-4 lg:px-0 ">
            <h2 className="text-lg font-semibold leading-tight md:text-xl lg:text-2xl dark:text-white">
              Input Invoice
            </h2>
            <button className="add-member-btn">
              <i className="fa-fa-solid add"></i>
              <a
                href={`/add-invoice`}
                className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-xs"> Add Invoice</span>
              </a>
            </button>
          </div>
          <div className="flex flex-col px-4 my-2 sm:flex-row lg:px-0">
            <div className="flex flex-row mb-1 sm:mb-0">
              <div className="relative">
                <select
                  className="appearance-none h-full rounded-l text-sm border block md:text-base lg:text-lg w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-[#0e1011] dark:focus:bg-[#0e1011] dark:focus:text-white dark:text-white"
                  onChange={(e) => {
                    const selectedPageSize = parseInt(e.target.value);
                    setInvoiceSummaryPageSize(parseInt(e.target.value));
                    getInvoiceSummaryPaginateData(1, selectedPageSize);
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
                onChange={(e) => setSearchInvoiceSummary(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    getInvoiceSummaryPaginateData(1, invoiceSummaryPageSize);
                  }
                }}
              />
            </div>
          </div>
          {inputDetails.length > 0 ? (
            <div
              className="dark:bg-[#0e1011] overflow-x-scroll px-4 md:px-8 lg:px-0"
              style={{ width: widthStyle }}
            >
              <div className="row row--top-40"></div>
              <div className="row row--top-20">
                <div className="col-md-12">
                  <div className="max-w-7xl dark:bg-[#0e1011]">
                    <table className="table w-full">
                      <thead className="table__thead dark:bg-[#0e1011] dark:text-white">
                        <tr>
                          {datas.inputInvoiceSummary.map(
                            (data, index: number) => {
                              return (
                                <th
                                  key={index}
                                  className="text-center table__th dark:text-white"
                                >
                                  {data.name}
                                </th>
                              );
                            }
                          )}
                          {/* <th className="text-center table__th dark:text-white">
                          No
                        </th>
                        <th className="text-center table__th dark:text-white">
                          Invoice Date
                        </th>
                        <th className="text-center table__th dark:text-white">
                          Invoice No
                        </th>
                        <th className="text-center table__th dark:text-white">
                          Client Name
                        </th>
                        <th className="text-center table__th dark:text-white">
                          City
                        </th>
                        <th className="text-center table__th dark:text-white">
                          Country
                        </th>
                        <th className="text-center table__th dark:text-white">
                          Total (Rp)
                        </th> */}
                        </tr>
                      </thead>
                      <tbody className="table__tbody">
                        {inputDetails?.map(
                          (details: InputInvoiceSummary, index: number) => {
                            return (
                              <tr
                                key={index}
                                className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                              >
                                <td data-column="No" className="table-row__td">
                                  {index + 1}
                                </td>

                                <td
                                  data-column="INVOICE DATE	"
                                  className="table-row__td "
                                >
                                  <div className="table-row__info w-[100px]">
                                    <div className="table-row text-center ">
                                      {details.date}
                                    </div>
                                  </div>
                                </td>
                                <td
                                  data-column="INVOICE NO	"
                                  className="table-row__td"
                                >
                                  <a
                                    href={`/input-invoice-details/${details.id}`}
                                    className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline hover:text-blue-600"
                                  >
                                    {details.no_invoice}
                                  </a>
                                </td>
                                <td
                                  data-column="CLIENT NAME"
                                  className=" table-row__td"
                                >
                                  <div className="table-row__info">
                                    {details.client_name}
                                  </div>
                                </td>
                                <td
                                  data-column="CITY	"
                                  className=" table-row__td"
                                >
                                  <div className="table-row__info">
                                    <div className=" table-row__name">
                                      {details.city}
                                    </div>
                                  </div>
                                </td>
                                <td
                                  data-column="COUNTRY"
                                  className=" table-row__td"
                                >
                                  <div className="table-row__info ">
                                    {details.country}
                                  </div>
                                </td>
                                <td
                                  data-column="TOTAL AMOUNT"
                                  className=" table-row__td"
                                >
                                  <div className="table-row__info ">
                                    Rp{" "}
                                    {(
                                      details.total_amount / 1000
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 3,
                                      maximumFractionDigits: 3,
                                    })}
                                  </div>
                                </td>

                                <td
                                  data-column="Action"
                                  className="table-row__td"
                                >
                                  <div className="table-row__progress status--blue status">
                                    <div className="w-full action">
                                      <a
                                        href={`/edit-input-invoice/${details.id}`}
                                      >
                                        <i className="fa-solid fa-pen text-[#3fd2ea]"></i>
                                      </a>
                                      <i
                                        onClick={() =>
                                          deleteInvoiceSummary(details.id)
                                        }
                                        className="cursor-pointer fa-solid fa-trash"
                                      ></i>
                                    </div>
                                  </div>
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
                    {invoiceSummaryPage > 1 ? (
                      <li>
                        <button
                          onClick={() => {
                            getInvoiceSummaryPaginateData(
                              invoiceSummaryPage - 1,
                              invoiceSummaryPageSize
                            );
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
                              getInvoiceSummaryPaginateData(
                                pageIndex,
                                invoiceSummaryPageSize
                              );
                            }}
                            className={`w-10 h-10 ${
                              invoiceSummaryPage === index + 1
                                ? "bg-indigo-600 text-white"
                                : ""
                            } text-indigo-600  transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100`}
                          >
                            {index + 1}
                          </button>
                        </li>
                      );
                    })}

                    {invoiceSummaryPage < totalPages ? (
                      <li>
                        <button
                          onClick={() => {
                            getInvoiceSummaryPaginateData(
                              invoiceSummaryPage + 1,
                              invoiceSummaryPageSize
                            );
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
            <div className="px-5 py-4 text-center text-gray-600 bg-gray-100">
              <p className="text-lg font-semibold">No Results Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputInvoicePage;
