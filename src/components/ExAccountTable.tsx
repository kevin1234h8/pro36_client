import axios from "axios";
import { AccountInterface } from "../interface/AccountInterface";
import datas from "../data/datas.json";
import { useState } from "react";
import SuccessModal from "./SuccessModal";
import DetailModal from "./DetailModal";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";
import NoResultsFound from "./NoResultsFound";
import { BASE_URL } from "../config/config";
import ReactPaginate from "react-paginate";
import {
  changeDateFormatAndIncrementHour,
  formatDateToDDMMYYYY,
} from "../utils/dateUtils";
import ExAccountPage from "../page/ExAccountPage";
const ExAccountTable = ({
  user,
  exAccount,
  getExAccountPaginateData,
  totalExAccount,
  exAccountPageSize,
  exAccountPage,
  parsedUserData,
  setExAccountPageSize,
  setExAccountSearch,
}: any) => {
  const widthStyle = useContainerWidthUtils();
  const [accountId, setAccountId] = useState<string>("");
  const totalPages = Math.ceil(totalExAccount / exAccountPageSize);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [isDetailModalVisible, setIsDetailModalVisible] =
    useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const restoreUser = async (id: string) => {
    const values = {
      restored_by: user?.id,
    };
    const confirmed = window.confirm(
      "Are you sure you want to restore this account ?"
    );
    if (confirmed) {
      try {
        const res = await axios.put(
          `${BASE_URL}/ex-account/restore/${id}`,
          values,
          {
            headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
          }
        );
        if (res.status === 200) {
          setIsSuccessModalVisible(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSort = (columnName: any) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const maxVisiblePages = 5; // Maximum number of visible page buttons excluding ellipsis

  // const handlePageClick = (pageNumber: any) => {
  //   if (pageNumber <= halfVisibleButtons + 1) {
  //     setStartPage(1);
  //     setEndPage(totalPages > maxVisiblePages ? maxVisiblePages : totalPages);
  //   } else if (pageNumber >= totalPages - halfVisibleButtons) {
  //     setStartPage(totalPages - maxVisiblePages + 1);
  //     setEndPage(totalPages);
  //   } else {
  //     setStartPage(pageNumber - halfVisibleButtons);
  //     setEndPage(pageNumber + halfVisibleButtons);
  //   }

  //   getExAccountPaginateData(pageNumber, exAccountPageSize);
  // };

  const sortedExAccount = [...exAccount].sort((a, b) => {
    if (sortColumn === "No") {
      return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
    } else if (sortColumn === "Regist Date") {
      const dateA = formatDateToDDMMYYYY(a.regist_date);
      const dateB = formatDateToDDMMYYYY(b.regist_date);

      if (dateA < dateB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (dateA > dateB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Client Name") {
      const clientNameA = a.client_name.toUpperCase();
      const clientNameB = b.client_name.toUpperCase();
      if (clientNameA < clientNameB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (clientNameA > clientNameB) {
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
    } else if (sortColumn === "Server") {
      const serverA = a.server.toUpperCase();
      const serverB = b.server.toUpperCase();
      if (serverA < serverB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (serverA > serverB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Expired Date") {
      const dateA = formatDateToDDMMYYYY(a.expired_date);
      const dateB = formatDateToDDMMYYYY(b.expired_date);

      if (dateA < dateB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (dateA > dateB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Ea Name") {
      const eaNameA = a.ea_name.toUpperCase();
      const eaNameB = b.ea_name.toUpperCase();
      if (eaNameA < eaNameB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (eaNameA > eaNameB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Remark") {
      const remarkA = a.remark.toUpperCase();
      const remarkB = b.remark.toUpperCase();
      if (remarkA < remarkB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (remarkA > remarkB) {
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
    } else if (sortColumn === "Recruit By") {
      const recruitByA = a.recruit_by.toUpperCase();
      const recruitByB = b.recruit_by.toUpperCase();
      if (recruitByA < recruitByB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (recruitByA > recruitByB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  let customPageNumber = 0;
  const handlePageClick = (event: any) => {
    console.log("page : ", event.selected + 1);
    customPageNumber = event.selected + 1;
    getExAccountPaginateData(event.selected + 1, exAccountPageSize);
  };
  const firstItemIndex = (exAccountPage - 1) * exAccountPageSize + 1;
  const lastItemIndex = Math.min(
    firstItemIndex + exAccountPageSize - 1,
    totalExAccount
  );
  return (
    <div className="w-full lg:mx-auto ">
      {isSuccessModalVisible ? (
        <SuccessModal
          text={`Account restored successfully!`}
          redirectLink="/ex-account"
        />
      ) : null}
      {isDetailModalVisible ? (
        <DetailModal
          accountId={accountId}
          setIsDetailModalVisible={setIsDetailModalVisible}
        />
      ) : null}
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-4 lg:px-0">
          <h2 className="text-lg font-semibold leading-tight md:text-xl lg:text-2xl dark:text-white">
            Ex Members
          </h2>
        </div>
        <div className="flex flex-col px-4 my-2 sm:flex-row lg:px-0">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
              <select
                className="appearance-none h-full rounded-l text-sm border block md:text-base lg:text-lg w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-[#0e1011] dark:focus:bg-[#0e1011] dark:focus:text-white dark:text-white"
                onChange={(e) => {
                  const selectedPageSize = parseInt(e.target.value);
                  setExAccountPageSize(parseInt(e.target.value));

                  getExAccountPaginateData(1, selectedPageSize);
                }}
              >
                <option
                  value="20"
                  className="text-[6px] md:text-[10px] lg:text-[12px]"
                >
                  20
                </option>
                <option
                  value="40"
                  className="text-[6px] md:text-[10px] lg:text-[12px]"
                >
                  40
                </option>
                <option
                  value="60"
                  className="text-[6px] md:text-[10px] lg:text-[12px]"
                >
                  60
                </option>
                <option
                  value="80"
                  className="text-[6px] md:text-[10px] lg:text-[12px]"
                >
                  80
                </option>
                <option
                  value="100"
                  className="text-[6px] md:text-[10px] lg:text-[12px]"
                >
                  100
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
              onChange={(e) => setExAccountSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  getExAccountPaginateData(1, exAccountPageSize);
                }
              }}
            />
          </div>
        </div>
        {exAccount?.length > 0 ? (
          <div
            className={`lg:w-full overflow-x-scroll  lg:overflow-x-hidden px-4 md:px-4 lg:px-0  dark:bg-[#0e1011] `}
            style={{ width: widthStyle }}
          >
            <div className="row row--top-40"></div>
            <div className="row row--top-20">
              <div className="col-md-12">
                <div className="table-container  dark:bg-[#0e1011]">
                  <table className="table">
                    <thead className="table__thead dark:bg-[#0e1011] dark:text-white">
                      <tr>
                        {datas.account_table_head.map((data, index) => {
                          const columnName = data.name;
                          const isSortableColumn =
                            columnName !== "No" && columnName !== "Action";
                          const isSortedColumn = sortColumn === columnName;
                          const sortClass = isSortedColumn
                            ? sortDirection === "asc"
                              ? "fa-solid fa-sort-down"
                              : "fa-solid fa-sort-up"
                            : "";

                          return (
                            <th
                              key={index}
                              className={`text-center table__th ${
                                columnName === "Account No" ? "w-[100px]" : ""
                              } dark:text-white  ${
                                !isSortableColumn ? "" : "cursor-pointer"
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
                        })}
                      </tr>
                    </thead>
                    <tbody className="table__tbody">
                      {sortedExAccount?.map(
                        (user: AccountInterface, index: number) => {
                          return (
                            <tr
                              key={index}
                              className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                            >
                              <td
                                data-column="No"
                                className="table-row__td  dark:text-[#a0a1a4] "
                              >
                                {index + 1}
                              </td>
                              <td
                                data-column="Regist Date"
                                className="table-row__td"
                              >
                                <div className="table-row__info">
                                  <p className="table-row__name w-[100px] dark:text-[#a0a1a4]  ">
                                    {changeDateFormatAndIncrementHour(
                                      user.regist_date
                                    )}
                                  </p>
                                </div>
                              </td>
                              <td
                                data-column="Client Name"
                                className="table-row__td "
                              >
                                <div className="table-row__info">
                                  <p className="table-row text-center  dark:text-[#a0a1a4] ">
                                    {user.client_name}
                                  </p>
                                </div>
                              </td>
                              <td
                                data-column="Account No"
                                className="table-row__td"
                              >
                                <a
                                  href={`/account-details/${user.id}`}
                                  className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline hover:text-blue-600"
                                >
                                  {user.account_no}
                                </a>
                              </td>
                              <td
                                data-column="Server"
                                className="table-row__td"
                              >
                                <p className="table-row__info  dark:text-[#a0a1a4] ">
                                  {user.server}
                                </p>
                              </td>

                              <td
                                data-column="Expired Date"
                                className="table-row__td "
                              >
                                <p className="table-row__info w-[100px]  dark:text-[#a0a1a4] ">
                                  {changeDateFormatAndIncrementHour(
                                    user.expired_date
                                  )}
                                </p>
                              </td>
                              <td
                                data-column="EA Name"
                                className="table-row__td"
                              >
                                <p className="table-row__info  dark:text-[#a0a1a4] ">
                                  {user.ea_name}
                                </p>
                              </td>

                              <td
                                data-column="Remark"
                                className="table-row__td"
                              >
                                <p className="table-row__info  dark:text-[#a0a1a4] ">
                                  {user.remark}
                                </p>
                              </td>
                              <td data-column="VPS" className="table-row__td">
                                <p className="table-row__info  dark:text-[#a0a1a4] ">
                                  {user.vps}
                                </p>
                              </td>
                              <td
                                data-column="Recruit By"
                                className="table-row__td"
                              >
                                <p className="table-row__info  dark:text-[#a0a1a4] ">
                                  {user.recruit_by}
                                </p>
                              </td>
                              <td
                                data-column="Progress"
                                className="table-row__td"
                              >
                                <p className="table-row__progress status--blue status">
                                  <div className="action">
                                    <i
                                      onClick={() => {
                                        setAccountId(user.id);
                                        setIsDetailModalVisible(true);
                                      }}
                                      className="fa-solid fa-eye text-[#3fd2ea] cursor-pointer"
                                    ></i>
                                    <i
                                      onClick={() => restoreUser(user.id)}
                                      className="fa-solid fa-arrow-rotate-right text-[#3fd2ea] cursor-pointer"
                                    ></i>
                                  </div>
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
                <div className="text-indigo-600 text-xs md:text-base lg:text-base">
                  Showing {firstItemIndex} - {lastItemIndex} of {totalExAccount}{" "}
                  Ex Account(s)
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NoResultsFound />
        )}
      </div>
    </div>
  );
};

export default ExAccountTable;
