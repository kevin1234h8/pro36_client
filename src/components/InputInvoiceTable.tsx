import React from "react";
import { InputInvoiceDetails } from "../interface/InputInvoiceDetailsInterface";
import datas from "../data/datas.json";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";
const InputInvoiceTable = ({ inputInvoiceDetails }: any) => {
  const containerWidth = useContainerWidthUtils();
  return (
    <div className="w-full px-4 mx-auto sm:px-8">
      <div className="py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold leading-tight dark:text-white">
            Members
          </h2>
          <button className="add-member-btn">
            <i className="fa-fa-solid add"></i>
            <a
              href="/add-member"
              className="relative px-5 py-3 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group"
            >
              <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
              <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
              <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
              <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
              <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
              <span className="relative text-xs transition-colors duration-300 delay-200 group-hover:text-white ease md:text-sm lg:text-sm">
                Add Member
              </span>
            </a>
          </button>
        </div>
        <div className="flex flex-col my-2 sm:flex-row">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
              <select
                className="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-[#0e1011] dark:focus:bg-[#0e1011] dark:focus:text-white dark:text-white"
                onChange={(e) => {
                  // const selectedPageSize = parseInt(e.target.value);
                  // setPageSize(parseInt(e.target.value));
                  // getPaginateData(1, selectedPageSize);
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
              className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none dark:text-white dark:bg-[#0e1011] dark:focus:bg-[#0e1011] dark:focus:text-white"
              // onChange={(e) => setSearch(e.target.value)}
              // onKeyPress={(e) => {
              //   if (e.key === "Enter") {
              //     getPaginateData(1, pageSize);
              //   }
              // }}
            />
          </div>
        </div>

        <div className="dark:bg-[#0e1011]" style={{ width: containerWidth }}>
          <div className="row row--top-40"></div>
          <div className="row row--top-20">
            <div className="col-md-12">
              <div className="table-container  dark:bg-[#0e1011]">
                <table className="table">
                  <thead className="table__thead dark:bg-[#0e1011] dark:text-white">
                    <tr>
                      {datas.inputInvoice.map((data: any) => {
                        return (
                          <th className="table__th dark:text-white">
                            {data.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="table__tbody">
                    {inputInvoiceDetails?.map(
                      (detail: InputInvoiceDetails, index: number) => {
                        return (
                          <tr
                            key={index}
                            className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                          >
                            <td className="table-row__td"> {index + 1}</td>
                            <td className="table-row__td">
                              <div className="table-row__info">
                                <p className="table-row__name">
                                  {detail.period_from.toLocaleString()}
                                </p>
                              </div>
                            </td>
                            <td data-column="Policy" className="table-row__td ">
                              <div className="">
                                <p className="table-row text-center">
                                  {detail.period_to.toLocaleString()}
                                </p>
                              </div>
                            </td>
                            <td
                              data-column="Policy status"
                              className="table-row__td"
                            >
                              <a
                                // href={`/account-details/${user.id}`}
                                className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline hover:text-blue-600"
                              >
                                {detail.account_no}
                              </a>
                            </td>
                            <td
                              data-column="Destination"
                              className="table-row__td"
                            >
                              <p className="table-row ">{detail.broker_name}</p>
                            </td>
                            <td data-column="Status" className="table-row__td ">
                              <p className="table-row ">{detail.profit}</p>
                            </td>
                            <td data-column="Status" className="table-row__td">
                              <p className="table-row ">
                                {detail.service_cost}
                              </p>
                            </td>

                            <td data-column="Status" className="table-row__td">
                              <p className="table-row ">
                                {detail.cost_in_rupiah}
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
            {/* <div className="flex items-center justify-center my-10">
              <ul className="inline-flex space-x-2">
                {page > 1 ? (
                  <li>
                    <button
                      onClick={() => {
                        getPaginateData(page - 1);
                      }}
                      className="flex items-center justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
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
                          getPaginateData(pageIndex);
                        }}
                        className={`w-10 h-10 ${
                          page === index + 1 ? "bg-indigo-600 text-white" : ""
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
                        getPaginateData(page + 1);
                      }}
                      className="flex items-center justify-center w-10 h-10 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputInvoiceTable;
