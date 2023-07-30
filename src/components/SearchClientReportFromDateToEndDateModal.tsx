import React from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { goBack } from "../utils/navigationUtils";

const SearchClientReportFromDateToEndDateModal = ({
  startDateValue,
  endDateValue,
  handleValueChange,
  handleEndDateValueChange,
  getClientReportAccounts,
}: any) => {
  return (
    <div
      className="min-w-screen  h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-[100] outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute inset-0 z-0 bg-black opacity-80"></div>
      <div className="relative w-full dark:bg-[#1e293b] max-w-lg p-5 mx-auto my-auto bg-white shadow-lg rounded-xl ">
        <div className="relative flex flex-col gap-8 ">
          <div className="lg:text-xl dark:text-white">Select Date Range</div>
          <div className="dark:text-white">
            Please enter the start date and end date values to retrieve the
            data. The data will be filtered based on the selected date range.
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-[200px] dark:text-white">Start Date: </div>
              <Datepicker
                showShortcuts={true}
                primaryColor={"indigo"}
                asSingle={true}
                value={startDateValue}
                onChange={handleValueChange}
                displayFormat={"DD-MM-YYYY"}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[200px] dark:text-white">End Date: </div>
              <Datepicker
                showShortcuts={true}
                primaryColor={"indigo"}
                asSingle={true}
                value={endDateValue}
                onChange={handleEndDateValueChange}
                displayFormat={"DD-MM-YYYY"}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div
              onClick={getClientReportAccounts}
              className=" cursor-pointer rounded text-center  px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs cursor-pointer">Submit</span>
            </div>
            <div
              onClick={goBack}
              className=" cursor-pointer rounded text-center  px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs cursor-pointer">Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchClientReportFromDateToEndDateModal;
