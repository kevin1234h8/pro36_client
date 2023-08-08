import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import datas from "../data/datas.json";
import { InputInvoiceSummary } from "../interface/InputInvoiceSummary";
import { changeDateFormatAndIncrementHour } from "../utils/dateUtils";
import { goBack } from "../utils/navigationUtils";
import { formatNumberToIDR } from "../utils/numberUtils";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";

const InvoiceSummaryDetails = ({ user, parsedUserData }: any) => {
  const { id } = useParams();
  const widthStyle = useContainerWidthUtils();
  const [invoiceSummary, setInvoiceSummary] = useState<InputInvoiceSummary>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [inputInvoiceDetails, setInputInvoiceDetails] = useState<any>([]);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    try {
      const getInvoiceSummary = async () => {
        const res = await axios.get(
          `${BASE_URL}/input-invoice/input-invoice-summary/${id}`
        );
        setInvoiceNumber(res.data.inputInvoiceSummary.no_invoice);
        setInvoiceSummary(res.data.inputInvoiceSummary);
        const parts = res.data.inputInvoiceSummary.date.split("-");
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        setDate(res.data.inputInvoiceSummary.date);
        const getInputInvoiceDetails = async () => {
          const invoiceDetailsRes = await axios.get(
            `${BASE_URL}/input-invoice/input-invoice-details/${res.data.inputInvoiceSummary.no_invoice}`,
            {
              headers: {
                Authorization: "Bearer " + parsedUserData?.accessToken,
              },
            }
          );
          setInputInvoiceDetails(invoiceDetailsRes.data.inputInvoiceDetails);
        };

        getInputInvoiceDetails();
      };
      getInvoiceSummary();
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const values: { deleted_by: string } = {
        deleted_by: user?.id || "", // Use a default value to avoid null/undefined errors
      };

      const confirmed = window.confirm(
        "Are you sure you want to delete this invoice ?"
      );
      if (confirmed) {
        const deleteInvoiceDetailsRes = await axios.delete(
          `${BASE_URL}/input-invoice/input-invoice-details/${invoiceNumber}`
        );

        const res = await axios.delete(
          `${BASE_URL}/input-invoice/input-invoice-summary/${id}/${user?.id}/${invoiceNumber}`,
          { data: values } // Send the data in the request body as required by axios for DELETE requests
        );

        if (res.status === 200) {
          setIsSuccessModalVisible(true); // Assuming you have a function to show the success modal
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dark:bg-[#0e1011]  ">
      {isSuccessModalVisible ? (
        <SuccessModal
          text={`invoice deleted successfully`}
          redirectLink={`/input-invoice`}
        />
      ) : null}
      <Navbar user={user} parsedUserData={parsedUserData} />
      <Breadcrumb />
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
                  value={changeDateFormatAndIncrementHour(invoiceSummary?.date)}
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
        </div>
      </div>
      <div className="flex flex-col items-center font-bold">
        <h2>Detail</h2>
        <div className="flex items-end justify-end"></div>
      </div>
      <div
        className={`lg:w-full  overflow-x-scroll md:overflow-x-hidden lg:overflow-x-hidden  px-4 md:px-8 lg:px-20  dark:bg-[#0e1011] `}
        style={{ width: widthStyle }}
      >
        <div className="row row--top-40"></div>
        <div className="row row--top-20">
          <div className="col-md-12">
            <div className="table-container  da rk:bg-[#0e1011]">
              <table className="table">
                <thead className="table__thead dark:bg-[#0e1011] dark:text-white">
                  <tr>
                    {datas.inputInvoice.map((data, index: number) => {
                      return (
                        <th
                          key={index}
                          className="text-center table__th dark:text-white"
                        >
                          {data.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="table__tbody">
                  {inputInvoiceDetails?.map((detail: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                      >
                        <td data-column="No" className="table-row__td">
                          {index + 1}
                        </td>
                        <td data-column="Period To" className="table-row__td ">
                          <div className="table-row__info">
                            <p className="table-row__name w-[100px]  dark:text-[#a0a1a4]">
                              {changeDateFormatAndIncrementHour(
                                detail.period_from
                              )}
                            </p>
                          </div>
                        </td>
                        <td
                          data-column="Period From"
                          className="table-row__td "
                        >
                          <div className="table-row__info w-[100px]">
                            <p className="text-center table-row__name   dark:text-[#a0a1a4]">
                              {changeDateFormatAndIncrementHour(
                                detail.period_to
                              )}
                            </p>
                          </div>
                        </td>
                        <td data-column="Account No" className="table-row__td">
                          <p className="flex items-center justify-center gap-2  dark:text-[#a0a1a4]">
                            {detail.account_no}
                          </p>
                        </td>
                        <td data-column="Broker Name" className="table-row__td">
                          <p className="flex items-center justify-center gap-2  dark:text-[#a0a1a4]">
                            {detail.broker_name}
                          </p>
                        </td>
                        <td data-column="Profit" className="table-row__td ">
                          <p className="flex items-center justify-center  dark:text-[#a0a1a4] ">
                            {formatNumberToIDR(detail.profit)}
                          </p>
                        </td>

                        <td data-column="Service" className="table-row__td">
                          <p className="flex items-center justify-center dark:text-[#a0a1a4]">
                            {formatNumberToIDR(detail.service_cost)}
                          </p>
                        </td>

                        <td data-column="Rupiah" className="table-row__td">
                          {formatNumberToIDR(detail.cost_in_rupiah)}
                        </td>
                        <td data-column="Action" className="table-row__td">
                          {/* <i
                              onClick={() => onRemoveDetailRow(index)}
                              className="text-red-500 cursor-pointer fa-solid fa-trash"
                            ></i> */}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="my-10 form-footer">
            <a
              href={`/edit-input-invoice/${id}`}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Edit</span>
            </a>
            <div
              onClick={handleDelete}
              className="cursor-pointer rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Delete</span>
            </div>
            <div
              onClick={goBack}
              className="cursor-pointer rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
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
