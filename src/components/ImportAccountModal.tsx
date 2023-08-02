import React from "react";
import datas from "../data/datas.json";
import transparentLoader from "../assets/transparentLoader.gif";
import {
  getIndonesianFormattedDate,
  getIndonesianFormattedDateUNION,
} from "../utils/dateUtils";

const ImportAccountModal = ({
  getInvoiceDetails,
  setInvoiceDetailsSearchQuery,
  invoiceDetailsSearchResults,
  setImportAccountModalVisible,
  handleImportInvoiceDetails,
  setCreatedDateInvoiceDetails,
  loadingImportDetails,
}: any) => {
  var currentDate = new Date();
  var yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  var oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(currentDate.getDate() - 7);
  var oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  var threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
  return (
    <div
      className="min-w-screen  h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-[100] outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute inset-0 z-0 bg-black opacity-80"></div>
      <div className="relative w-full dark:bg-[#1e293b] max-w-lg p-5 mx-auto my-auto bg-white shadow-lg rounded-xl ">
        <div className="relative flex flex-col items-center gap-8 overflow-y-auto">
          <div className="absolute top-0 right-0">
            <i
              onClick={() => setImportAccountModalVisible(false)}
              className="fa-solid fa-xmark dark:text-white"
            ></i>
          </div>
          <div className="justify-center flex-auto p-5 text-center">
            <p className="px-8 text-sm text-gray-500"></p>
          </div>
          <div className="relative dark:bg-[#1e293b] flex items-center justify-between w-full px-5 py-3 mx-auto text-sm text-gray-600 bg-white border-2 border-gray-300 rounded-lg">
            <input
              className="w-full bg-white focus:outline-none dark:bg-[#1e293b] dark:focus:bg-[#1e293b] dark:text-white "
              type="text"
              name="search"
              placeholder="Search By Type"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  getInvoiceDetails();
                }
              }}
              onChange={(e) => setInvoiceDetailsSearchQuery(e.target.value)}
            />
            <select
              onChange={(e) => setCreatedDateInvoiceDetails(e.target.value)}
              name=""
              id=""
              className="px-2 py-1 mr-2 border-none cursor-pointer oultine-none focus:outline-none dark:bg-[#1e293b] dark:text-white"
            >
              <option value="">all</option>
              <option value={currentDate.toISOString().substring(0, 10)}>
                today
              </option>
              <option value={yesterday.toISOString().substring(0, 10)}>
                within 1 day
              </option>
              <option value={oneWeekAgo.toISOString().substring(0, 10)}>
                within 1 week
              </option>
              <option value={oneMonthAgo.toISOString().substring(0, 10)}>
                within 1 month
              </option>
              <option value={threeMonthsAgo.toISOString().substring(0, 10)}>
                within 3 month
              </option>
            </select>
            <i
              onClick={getInvoiceDetails}
              className="cursor-pointer fa-solid fa-magnifying-glass dark:text-white"
            ></i>
            <button
              type="submit"
              className="absolute top-0 right-0 px-4 mt-5 mr-4"
            ></button>
          </div>
          <div className="w-full dark:bg-[#1e293b] max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 overflow-x-auto h-[300px] overflow-y-scroll">
            <header className="px-5 py-4 border-b border-gray-100">
              <div className="font-semibold text-gray-800 dark:text-white">
                Invoice Details
              </div>
            </header>

            {invoiceDetailsSearchResults.length > 0 ? (
              <div className="p-3 overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="text-xs font-semibold text-gray-400 uppercase bg-gray-50 dark:bg-[#1e293b]">
                    <tr>
                      {datas.importInvoiceDetails.map((data, index: number) => {
                        return (
                          <th key={index} className="p-2">
                            <div className="font-semibold text-left dark:text-white ">
                              {data.name}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  {loadingImportDetails ? (
                    <div className="flex items-center justify-center w-full ">
                      <img
                        className="flex items-center w-20 h-20"
                        src={transparentLoader}
                        alt=""
                      />
                    </div>
                  ) : (
                    <tbody className="text-sm divide-y divide-gray-100">
                      {invoiceDetailsSearchResults?.map(
                        (result: any, index: number) => {
                          return (
                            <tr key={index}>
                              <td className="p-2">
                                <div className="font-medium text-gray-800 dark:text-white">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="py-2 w-[100px]">
                                <div className="font-medium text-gray-800 dark:text-white">
                                  {getIndonesianFormattedDateUNION(
                                    result.period_from
                                  )}
                                </div>
                              </td>
                              <td className="p-2">
                                <div className="text-left dark:text-white">
                                  {result.no_invoice}
                                </div>
                              </td>

                              <td className="p-2">
                                <div className="font-medium text-left dark:text-white ">
                                  {result.broker_name}
                                </div>
                              </td>
                              <td className="p-2">
                                <div className="flex justify-center">
                                  <button
                                    onClick={() =>
                                      handleImportInvoiceDetails(result.id)
                                    }
                                  >
                                    <i className="fa-solid fa-cloud-arrow-up text-[#1E90FF]"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  )}
                </table>
              </div>
            ) : (
              <div className="w-full px-5 py-4 text-center text-gray-600 dark:bg-[#1e293b] dark:text-white bg-gray-100">
                <p className="text-lg font-semibold">No Results Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportAccountModal;
