import React, { useEffect, useState } from "react";
import { InputInvoiceSummary } from "../interface/InputInvoiceSummary";
import { useParams } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import Navbar from "../components/Navbar";
import axios from "axios";
import { BASE_URL } from "../config/config";

const InvoiceSummaryDetails = ({ user }: any) => {
  const { id } = useParams();
  const [invoiceSummary, setInvoiceSummary] = useState<InputInvoiceSummary>();
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  useEffect(() => {
    const getInvoiceSummary = async () => {
      const res = await axios.get(
        `${BASE_URL}/input-invoice/input-invoice-summary/${id}`
      );
      setInvoiceSummary(res.data.inputInvoiceSummary);
    };
    getInvoiceSummary();
  }, []);

  const handleDelete = async () => {
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
  };
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="dark:bg-[#0e1011]  ">
      {isSuccessModalVisible ? (
        <SuccessModal
          text={`invoice deleted successfully`}
          redirectLink={`/`}
        />
      ) : null}
      <Navbar user={user} />
      <div className="add-member-container lg:mx-[10rem] dark:text-white   ">
        <div className="add-member-form w-100">
          <h2 className="font-medium add-member-form-title">
            Invoice Summary Details
          </h2>
          <form className="form" action="#">
            <div className="w-full">
              <div className="input-box">
                <input
                  type="text"
                  value={invoiceSummary?.no_invoice || ""}
                  name=""
                  required
                  readOnly
                />
                <label>No invoice</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  defaultValue={invoiceSummary?.date}
                  name=""
                  required
                  readOnly
                />
                <label>Date</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  defaultValue={invoiceSummary?.client_name}
                  name=""
                  required
                  readOnly
                />
                <label>Client Name</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  defaultValue={invoiceSummary?.service_fee}
                  name=""
                  required
                  readOnly
                />
                <label>Service Fee</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  defaultValue={invoiceSummary?.rate}
                  name=""
                  required
                  readOnly
                />
                <label>Rate</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  defaultValue={invoiceSummary?.city}
                  required
                  readOnly
                />
                <label>City</label>
              </div>
            </div>
            <div className="w-full">
              <div className="input-box">
                <input
                  id="RegistDate"
                  defaultValue={invoiceSummary?.country}
                  type="text"
                  readOnly
                />
                <label>Country</label>
              </div>
              <div className="input-box">
                <input
                  id="RegistDate"
                  defaultValue={invoiceSummary?.bank_name}
                  type="text"
                  readOnly
                />
                <label>Bank Name</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  defaultValue={invoiceSummary?.bank_beneficiary}
                  required
                  readOnly
                />
                <label>Bank Beneficiary Name</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  defaultValue={invoiceSummary?.bank_no}
                  name=""
                  required
                  readOnly
                />
                <label>Bank Account No</label>
              </div>
            </div>
          </form>
          <div className="form-footer">
            <a
              href={`/edit-input-invoice/${id}`}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Edit</span>
            </a>
            <div
              onClick={handleDelete}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Delete</span>
            </div>
            <div
              onClick={goBack}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Cancel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummaryDetails;
