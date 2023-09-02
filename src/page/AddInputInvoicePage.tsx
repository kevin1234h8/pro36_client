import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useEffect, useState } from "react";
import ImportAccountModal from "../components/ImportAccountModal";
import ImportMemberAccountModal from "../components/ImportMemberAccountModal";
import ImportModal from "../components/ImportModal";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import datas from "../data/datas.json";
import { DetailRow } from "../interface/DetailRowInterface";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";
import { formatNumberToIDR } from "../utils/numberUtils";
import { v4 } from "uuid";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  changeDateFormatAndIncrementHour,
  formatDateFromLongStringToDDMMYYYY,
  formatDateToYYYYMMDD,
  getIndonesianFormattedDate,
  getIndonesianFormattedDateUNION,
} from "../utils/dateUtils";
import { goBack } from "../utils/navigationUtils";
const Summary = ({
  setInvoiceNo,
  setServiceFee,
  setClientName,
  setRate,
  setCity,
  setCountry,
  invoiceNo,
  clientName,
  date,
  serviceFee,
  rate,
  city,
  country,
  setIsImportModalIsVisible,
  setInvoiceNoDate,
  invoiceNoDate,
  parsedUserData,
}: any) => {
  const currentDate = new Date();
  function convertToRoman(month: number) {
    const romanNumerals = [
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ];

    return romanNumerals[month];
  }
  const monthNumber = date.getMonth() + 1; // Adding 1 to get the month number from 1 to 12
  const romanMonth = convertToRoman(monthNumber);

  useEffect(() => {
    const getLastestInvoiceNo = async () => {
      try {
        await axios.get(`${BASE_URL}/input-invoice/lastest-no-invoice`);
        const currentDate = new Date();
        const currentDatePortion = `${currentDate.getFullYear()}/${romanMonth}/${currentDate.getDate()}/`;
        setInvoiceNoDate(currentDatePortion);
      } catch (error) {
        console.log("Error retrieving latest invoice number:", error);
      }
    };

    getLastestInvoiceNo();
  }, []);

  useEffect(() => {
    const currentDatePortion = `${currentDate.getFullYear()}/${romanMonth}/${currentDate.getDate()}/`;
    setInvoiceNoDate(currentDatePortion);
    const values = {
      date: currentDatePortion,
    };
    const getInvoiceNumber = async () => {
      const res = await axios.post(
        `${BASE_URL}/input-invoice/invoice-number`,
        values,
        { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
      );
      setInvoiceNo(res.data.invoiceNumber);
    };
    getInvoiceNumber();
  }, [invoiceNoDate]);

  return (
    <div>
      <div className="add-member-container lg:mx-[10rem] dark:text-white">
        <div className="add-member-form w-100">
          <h2 className="font-bold add-member-form-title">Summary</h2>
          <div className="flex justify-end">
            <button
              onClick={() => setIsImportModalIsVisible(true)}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Import</span>
            </button>
          </div>
          <form className="form lg:w-full ">
            <div className=" w-[100%] md:w-[768px] max-w-7xl lg:w-full">
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  defaultValue={invoiceNo}
                  readOnly
                />
                <label>No Invoice</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  readOnly
                  value={date
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\//g, "-")}
                />
                <label>Date</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <label>Client Name</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={serviceFee}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);

                    if (value > 100) {
                      value = 100;
                    }

                    setServiceFee(value);
                  }}
                />
                <label>Service Fee (%)</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  name=""
                  min={1}
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                <label>Rate</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <label>City</label>
              </div>
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <label>Country</label>
              </div>
            </div>
            <div className="form-footer"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

// TransferTo component
const TransferTo = ({
  setBankName,
  setBeneficiaryName,
  setAccountNumber,
  accountNumber,
  bankName,
  beneficiaryName,
}: any) => {
  return (
    <div>
      <div className="add-member-container lg:mx-[10rem] dark:text-white ">
        <div className="add-member-form w-100">
          <h2 className="font-bold add-member-form-title">Transfer To</h2>
          <form className="form lg:w-full">
            <div className="w-[100%] md:w-[768px] lg:w-full">
              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
                <label>Bank Name</label>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name=""
                  required
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                />
                <label>Bank Beneficiary Name</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  name=""
                  value={accountNumber}
                  min={1}
                  required
                  onChange={(e) => setAccountNumber(parseInt(e.target.value))}
                />
                <label>Bank Account No</label>
              </div>
            </div>
            <div className="form-footer"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Detai;l component

interface DetailProps {
  details: DetailRow[];
  onAddDetailRow: () => void;
  onDetailChange: (
    index: number,
    field: keyof DetailRow,
    value: string
  ) => void;
  onRemoveDetailRow: (index: number) => void;
}

const Detail: React.FC<any> = ({
  details,
  serviceFee,
  addInputInvoiceDetails,
  onDetailChange,
  rate,
  setImportAccountModalVisible,
  onRemoveDetailRow,
  setImportMemberAccountModalVisible,
  user,
}) => {
  const widthStyle = useContainerWidthUtils();
  const handleInputChange = (
    index: number,
    field: keyof DetailRow,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onDetailChange(index, field, event.target.value);
  };

  // const handleInputChangeFloat = (
  //   index: number,
  //   field: keyof DetailRow,
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   let newValue = parseFloat(event.target.value);
  //   if (field === "service") {
  //     // Convert the percentage input to a decimal value
  //     newValue = newValue / 100;
  //   }
  //   onDetailChange(index, field, newValue);
  // };
  // const getService = () => {
  //   details?.map((detail: any) => {
  //     return detail.service;
  //   });
  // };
  return (
    <div className=" max-w-7xl">
      <div className="flex flex-col items-center font-bold">
        <h2>Detail</h2>
        <div className="flex items-end justify-end"></div>
      </div>
      <div className="flex justify-end w-full gap-4 px-4 lg:px-20">
        <button
          onClick={addInputInvoiceDetails}
          className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative text-xs">Add</span>
        </button>
        <button
          onClick={() => setImportAccountModalVisible(true)}
          className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative text-xs">Import Details</span>
        </button>
        {user?.level === 3 ? null : (
          <button
            onClick={() => setImportMemberAccountModalVisible(true)}
            className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative text-xs">Import Account</span>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex justify-end w-full"></div>
      </div>
      {details.length > 0 ? (
        <div
          className={`lg:w-full overflow-x-scroll lg:overflow-x-hidden   px-4 md:px-8 lg:px-8  dark:bg-[#0e1011] `}
          style={{ width: widthStyle }}
        >
          <div className="row row--top-40"></div>
          <div className="row row--top-20">
            <div className="overflow-x-scroll col-md-12">
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
                    {details?.map((detail: any, index: number) => {
                      return (
                        <tr
                          key={index}
                          className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                        >
                          <td data-column="No" className="table-row__td">
                            {index + 1}
                          </td>
                          <td
                            data-column="Period To"
                            className="table-row__td "
                          >
                            <div className="table-row__info">
                              <input
                                type="text"
                                className="text-center border-none appearance-none cursor-pointer  dark:text-[#a0a1a4]   dark:bg-[#0e1011] "
                                placeholder="0"
                                min={1}
                                value={detail.periodFrom}
                                onChange={(e) =>
                                  handleInputChange(index, "periodFrom", e)
                                }
                              />
                            </div>
                          </td>
                          <td
                            data-column="Period From"
                            className="table-row__td "
                          >
                            <div className="table-row__info ">
                              <input
                                type="text"
                                className="text-center border-none appearance-none cursor-pointer  dark:text-[#a0a1a4]   dark:bg-[#0e1011] "
                                placeholder="0"
                                min={1}
                                value={detail.periodTo}
                                onChange={(e) =>
                                  handleInputChange(index, "periodTo", e)
                                }
                              />
                            </div>
                          </td>
                          <td
                            data-column="Account No"
                            className="table-row__td"
                          >
                            <p className="flex items-center justify-center gap-2">
                              <input
                                type="number"
                                className="text-center border-none appearance-none cursor-pointer  dark:text-[#a0a1a4]   dark:bg-[#0e1011] "
                                // placeholder="0"
                                min={1}
                                value={detail.accountNo}
                                onChange={(e) =>
                                  handleInputChange(index, "accountNo", e)
                                }
                              />
                            </p>
                          </td>
                          <td
                            data-column="Broker Name"
                            className="table-row__td"
                          >
                            <p className="flex items-center justify-center gap-2">
                              <input
                                className="text-center  cursor-pointer  dark:text-[#a0a1a4]  dark:bg-[#0e1011] "
                                type="text"
                                value={detail.broker}
                                placeholder=""
                                onChange={(e) =>
                                  handleInputChange(index, "broker", e)
                                }
                              />
                            </p>
                          </td>
                          <td data-column="Profit" className="table-row__td ">
                            <p className="flex items-center justify-center ">
                              <input
                                className="text-center  cursor-pointer  dark:text-[#a0a1a4]  dark:bg-[#0e1011] "
                                type="number"
                                // placeholder="0"
                                value={detail.profit}
                                onChange={(e) =>
                                  handleInputChange(index, "profit", e)
                                }
                              />
                            </p>
                          </td>

                          <td data-column="Service" className="table-row__td">
                            <p className="flex items-center justify-center ">
                              <input
                                className="text-center outline-none  dark:text-[#a0a1a4] dark:bg-[#0e1011] "
                                type="number"
                                step="0.01"
                                placeholder="0"
                                value={
                                  detail.service === 0
                                    ? parseFloat(
                                        (
                                          detail.profit *
                                          (serviceFee / 100)
                                        ).toFixed(2)
                                      )
                                    : parseInt(detail.service)
                                }
                                readOnly
                                onChange={(e) =>
                                  handleInputChange(index, "service", e)
                                }
                              />
                            </p>
                          </td>

                          <td data-column="Rupiah" className="table-row__td">
                            {detail.rupiah === 0
                              ? parseFloat(
                                  (
                                    detail.profit *
                                    (serviceFee / 100) *
                                    rate
                                  ).toFixed(2)
                                ).toLocaleString("id-ID", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                  style: "decimal",
                                  useGrouping: true,
                                })
                              : parseInt(detail.rupiah)}
                          </td>
                          <td data-column="Action" className="table-row__td">
                            <i
                              onClick={() => onRemoveDetailRow(index)}
                              className="text-red-500 cursor-pointer fa-solid fa-trash"
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 mt-4 py-4 text-center text-gray-600 bg-gray-100 dark:bg-[#0e1011]">
          <p className="text-xs md:text-base lg:text-xl font-semibold dark:text-[#e4e4e4]">
            No Invoice Added
          </p>
        </div>
      )}
    </div>
  );
};

const InvoiceDocument = ({
  details,
  clientName,
  rate,
  setLoading,
  serviceFee,
  invoiceNo,
  date,
  city,
  country,
  bankName,
  beneficiaryName,
  accountNumber,
  user,
  setIsSuccessModalVisible,
  invoiceNoDate,
  parsedUserData,
}: any) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = today.getDate();

  // Form a string representation of today's date in the format "YYYY-MM-DD"
  const todayDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  const [totalAmountInRupiah, setTotalAmountInRupiah] = useState(0);
  const [totalServiceFee, setTotalServiceFee] = useState(0);
  useEffect(() => {
    if (details) {
    }
  }, [details]);
  let uuidv4: string;
  uuidv4 = v4();
  const [id] = useState<string>(uuidv4);

  const generatePDF = async () => {
    setLoading(true);
    let isFirstPage = true;
    const doc = new jsPDF();
    const startY = 80; // Initial Y-coordinate for the table
    const tableStartY = startY + 10;
    const rowHeight = 10; // Adjust the row height as needed

    const rows = details?.map((detail: any, index: number) => [
      index + 1,
      detail.periodFrom,
      detail.periodTo,
      detail.accountNo,
      detail.broker,
      "$" + formatNumberToIDR(parseFloat(detail.profit).toFixed(2)),
      detail.service
        ? "$" + detail.service
        : "$" +
          formatNumberToIDR((detail.profit * (serviceFee / 100)).toFixed(2)),
      detail.rupiah
        ? "Rp" + detail.rupiah
        : "Rp" +
          parseFloat(
            (detail.profit * (serviceFee / 100) * rate).toFixed(2)
          ).toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            style: "decimal",
            useGrouping: true,
          }),
    ]);

    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    const hasInvalidDate = details?.some(
      (detail: any) =>
        !dateRegex.test(detail.periodFrom) || !dateRegex.test(detail.periodTo)
    );

    if (hasInvalidDate) {
      setLoading(false);
      alert(
        "Invalid period from or period to date format, please use the format dd-mm-yyyy. For example, 17-05-2023."
      );
      return;
    }
    // If all date formats are correct, create the array of values
    const values = details?.map((detail: any, index: number) => [
      invoiceNo,
      formatDateToYYYYMMDD(detail.periodFrom),
      formatDateToYYYYMMDD(detail.periodTo),
      detail.accountNo,
      detail.broker,
      parseFloat(detail.profit).toFixed(2),
      (parseFloat(detail.profit) * (serviceFee / 100)).toFixed(2),
      (parseFloat(detail.profit) * (serviceFee / 100) * rate).toFixed(2),
      user?.id,
      user?.id,
    ]);

    // Continue with the rest of your logic (e.g., submitting the data)
    try {
      const res = await axios.post(
        `${BASE_URL}/input-invoice/input-invoice-details/create`,
        { values },
        { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
      );
    } catch (error) {
      console.error(error);
    }
    const totalAmount = details.reduce((sum: number, detail: any) => {
      const amount = detail.rupiah
        ? detail.rupiah
        : (detail.profit * (serviceFee / 100) * rate).toFixed(2);
      return sum + parseFloat(amount);
    }, 0);
    setTotalAmountInRupiah(totalAmount.toFixed(2));
    const formattedTotalAmount = formatNumberToIDR(totalAmount.toFixed(2));
    const totalUSDProfit = details.reduce((sum: number, detail: any) => {
      const profit = detail.profit;
      return sum + parseFloat(profit);
    }, 0);

    const totalFee = details.reduce((sum: number, detail: any) => {
      // const fee = Number(detail.service) ;
      const fee = detail.service
        ? detail.service
        : (detail.profit * (serviceFee / 100)).toFixed(2);
      return sum + parseFloat(fee);
    }, 0);
    const summaryValues = {
      invoiceNo: invoiceNoDate,
      date: todayDate,
      clientName,
      serviceFee,
      rate,
      city,
      country,
      bankName,
      beneficiaryName,
      accountNumber,
      totalAmountInRupiah: totalAmount,
      created_by: user?.id,
      owner: user?.id,
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/input-invoice/input-invoice-summary/create`,
        summaryValues,
        { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
      );
    } catch (err) {
      console.log(err);
    }
    const totalRow = [
      "Total",
      "",
      "",
      "",
      "",
      "$" + formatNumberToIDR(parseFloat(totalUSDProfit).toFixed(2)),
      "$" + formatNumberToIDR(totalFee.toFixed(2)),
      "Rp" + formattedTotalAmount,
    ];
    rows.push(totalRow);
    // Set table properties
    const tableProps = {
      startY: startY,
      margin: { top: 150 },
    };

    const formattedDate = formatDateFromLongStringToDDMMYYYY(date);

    const tableHeaders = datas.inputInvoiceDetailsTableHeaders;
    const tableData = [tableHeaders, ...rows];

    const drawFirstPageContent = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(clientName, 15, 20);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(city, 15, 25);
      doc.text(country, 15, 30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setFillColor(255, 165, 0); // Orange color
      doc.rect(15, 43, 70, 10, "F");
      doc.text("SERVICE FEE", 15, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("SERVICE FEE (%)", 15, 57);
      doc.text("Rate", 15, 64);
      doc.setFont("helvetica", "normal");
      doc.text(serviceFee + "%", 50, 57);
      doc.text("Rp" + formatNumberToIDR(parseFloat(rate).toFixed(2)), 50, 64);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Statement Date", 120, 15);
      doc.text("Statement No.", 120, 20);
      doc.setFont("helvetica", "normal");
      doc.text(formattedDate, 170, 15);
      doc.text(invoiceNo, 170, 20);

      doc.setFont("helvetica", "bold");
      doc.setFillColor(255, 165, 0); // Orange color
      doc.rect(118, 43, 80, 10, "F");
      doc.text("PAYMENT SUMMARY", 120, 50);
      doc.text("Ammount (Rp)", 170, 50);
      doc.text("Total", 120, 57);
      doc.setFont("helvetica", "normal");

      doc.text("Rp" + formattedTotalAmount, 170, 57);
      isFirstPage = false;
    };
    const tableHeight = tableData.length * rowHeight;

    const tableConfig = {
      startY: tableStartY,
      head: [tableHeaders],
      body: rows,
      didDrawPage: (data: any) => {
        if (isFirstPage) {
          // Draw the content at the top of the first page
          drawFirstPageContent();
          isFirstPage = false; // Set the flag to false after drawing the first page
        } else {
          // Draw the content at the bottom of the table on subsequent pages
        }
      },
    };
    autoTable(doc, tableConfig);

    doc.setFontSize(10);
    doc.text(
      "Payment By Transfer To (Full amount in Rupiah)",
      15,
      startY + tableHeight + 30
    );
    doc.setFont("helvetica", "bold");
    doc.text(bankName, 15, startY + tableHeight + 40);
    doc.text(beneficiaryName, 15, startY + tableHeight + 45);
    doc.text(accountNumber.toString(), 15, startY + tableHeight + 50);

    doc.setFont("helvetica", "italic");

    // Set the underline style

    // Set the font size and text color
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    // Add the text with underline and italic style
    doc.rect(8, tableStartY + tableHeight + 65, 195, 10);
    doc.text(
      "Please make a payment within 7 days after this statement is issued, otherwise, the software will be deactivated",
      12,
      tableStartY + tableHeight + 70
    );
    setLoading(false);

    setIsSuccessModalVisible(true);
    // doc.save(`${invoiceNo}_invoice.pdf`);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const previewPDF = async () => {
    const doc = new jsPDF();
    const startY = 80; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed
    let isFirstPage = true;
    const tableStartY = startY + 10;

    const totalAmount = details.reduce((sum: number, detail: any) => {
      const amount = detail.rupiah
        ? detail.rupiah
        : parseFloat((detail.profit * (serviceFee / 100) * rate).toFixed(2));
      return sum + parseFloat(amount);
    }, 0);
    setTotalAmountInRupiah(totalAmount.toFixed(2));

    const totalFee = details.reduce((sum: number, detail: any) => {
      // const fee = Number(detail.service) ;
      const fee = detail.service
        ? detail.service
        : (detail.profit * (serviceFee / 100)).toFixed(2);
      return sum + parseFloat(fee);
    }, 0);

    setTotalServiceFee(totalFee.toFixed(2));
    const rows = details?.map((detail: any, index: number) => [
      index + 1,
      detail.periodFrom,
      detail.periodTo,
      detail.accountNo,
      detail.broker,
      "$" + formatNumberToIDR(parseFloat(detail.profit).toFixed(2)),
      detail.service
        ? "$" + detail.service
        : "$" +
          formatNumberToIDR((detail.profit * (serviceFee / 100)).toFixed(2)),
      detail.rupiah
        ? "Rp" + detail.rupiah
        : "Rp" +
          parseFloat(
            (detail.profit * (serviceFee / 100) * rate).toFixed(2)
          ).toLocaleString("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            style: "decimal",
            useGrouping: true,
          }),
    ]);

    const totalUSDProfit = details.reduce((sum: number, detail: any) => {
      const profit = detail.profit;
      return sum + parseFloat(profit);
    }, 0);

    const formattedTotalAmount = formatNumberToIDR(totalAmount.toFixed(2));

    const totalRow = [
      "Total",
      "",
      "",
      "",
      "",
      "$" + formatNumberToIDR(parseFloat(totalUSDProfit).toFixed(2)),
      "$" + formatNumberToIDR(totalFee.toFixed(2)),
      "Rp" + formattedTotalAmount,
    ];
    rows.push(totalRow);
    // Set table properties
    const tableProps = {
      startY: startY,
      margin: { top: 150 },
    };

    const formattedDate = formatDateFromLongStringToDDMMYYYY(date);

    const tableHeaders = datas.inputInvoiceDetailsTableHeaders;
    const tableData = [tableHeaders, ...rows];

    const drawFirstPageContent = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(clientName, 15, 20);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.text(city, 15, 25);
      doc.text(country, 15, 30);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setFillColor(255, 165, 0); // Orange color
      doc.rect(15, 43, 70, 10, "F");
      doc.text("SERVICE FEE", 15, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("SERVICE FEE (%)", 15, 57);
      doc.text("Rate", 15, 64);
      doc.setFont("helvetica", "normal");
      doc.text(serviceFee + "%", 50, 57);
      doc.text("Rp" + formatNumberToIDR(parseFloat(rate).toFixed(2)), 50, 64);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Statement Date", 120, 15);
      doc.text("Statement No.", 120, 20);
      doc.setFont("helvetica", "normal");
      doc.text(formattedDate, 170, 15);
      doc.text(invoiceNo, 170, 20);

      doc.setFont("helvetica", "bold");
      doc.setFillColor(255, 165, 0); // Orange color
      doc.rect(118, 43, 80, 10, "F");
      doc.text("PAYMENT SUMMARY", 120, 50);
      doc.text("Ammount (Rp)", 170, 50);
      doc.text("Total", 120, 57);
      doc.setFont("helvetica", "normal");

      doc.text("Rp" + formattedTotalAmount, 170, 57);
      isFirstPage = false;
    };
    const tableHeight = tableData.length * rowHeight;

    const tableConfig = {
      startY: tableStartY,
      head: [tableHeaders],
      body: rows,
      didDrawPage: (data: any) => {
        if (isFirstPage) {
          // Draw the content at the top of the first page
          drawFirstPageContent();
          isFirstPage = false; // Set the flag to false after drawing the first page
        } else {
          // Draw the content at the bottom of the table on subsequent pages
        }
      },
    };
    autoTable(doc, tableConfig);

    doc.setFontSize(10);
    doc.text(
      "Payment By Transfer To (Full amount in Rupiah)",
      15,
      startY + tableHeight + 30
    );
    doc.setFont("helvetica", "bold");
    doc.text(bankName, 15, startY + tableHeight + 40);
    doc.text(beneficiaryName, 15, startY + tableHeight + 45);
    doc.text(accountNumber.toString(), 15, startY + tableHeight + 50);

    doc.setFont("helvetica", "italic");

    // Set the underline style

    // Set the font size and text color
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    // Add the text with underline and italic style
    doc.rect(8, tableStartY + tableHeight + 65, 195, 10);
    doc.text(
      "Please make a payment within 7 days after this statement is issued, otherwise, the software will be deactivated",
      12,
      tableStartY + tableHeight + 70
    );
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-8 ">
      <div className="container flex justify-end w-full px-4 mx-auto my-10 lg:px-4">
        {details.length > 0 &&
        clientName !== "" &&
        serviceFee !== 0 &&
        rate !== 0 &&
        city !== "" &&
        country !== "" &&
        bankName !== "" &&
        beneficiaryName !== "" &&
        accountNumber !== "" ? (
          <div className="flex items-center gap-4">
            <button
              onClick={previewPDF}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Preview PDF</span>
            </button>
            <button
              onClick={generatePDF}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Save</span>
            </button>
            <button
              onClick={goBack}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Cancel</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export interface InvoiceDocumentRef {
  print: () => void;
}

const AddInputInvoicePage = ({ user, parsedUserData }: any) => {
  const [invoiceNo, setInvoiceNo] = useState("");

  const [date, setDate] = useState(new Date());
  const [clientName, setClientName] = useState("");
  const [serviceFee, setServiceFee] = useState<number>(10);
  const [rate, setRate] = useState<number>(15000);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [bankName, setBankName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [accountNumber, setAccountNumber] = useState<number>();
  const [invoiceNoDate, setInvoiceNoDate] = useState("");
  const [details, setDetails] = useState<DetailRow[]>([]);

  const [profit, setProfit] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState([]);
  const [invoiceDetailsSearchQuery, setInvoiceDetailsSearchQuery] =
    useState<string>("");
  const [memberAccountSearchQuery, setMemberAccountSearchQuery] =
    useState<string>("");
  const [invoiceDetailsSearchResults, setInvoiceDetailsSearchResults] =
    useState<any>([]);
  const [isImportModalIsVisible, setIsImportModalIsVisible] = useState(false);
  const [isImportAccountModalVisible, setImportAccountModalVisible] =
    useState<boolean>(false);
  const [
    isImportMemberAccountModalVisible,
    setImportMemberAccountModalVisible,
  ] = useState<boolean>(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [createdDate, setCreatedDate] = useState<string>("");
  const [createdDateInvoiceDetails, setCreatedDateInvoiceDetails] =
    useState<string>("");
  const [createdDateMemberAccount, setCreatedDateMemberAccount] =
    useState<string>("");
  const [memberAccounts, setMemberAccounts] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const [searchMemberAccountByQuery, setSearchMemberAccountByQuery] =
    useState("account_no");
  const [loadingImportMemberAccount, setLoadingImportMemberAccount] =
    useState(false);
  const [loadingImportDetails, setLoadingImportDetails] = useState(false);

  const getImportAccount = async () => {
    const res = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-summary?pageSize=100&search=${searchQuery}&createdDate=${createdDate}`,
      { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
    );
    setSearchResults(res.data.inputInvoiceSummary);
  };

  // useEffect(() => {
  //   try {
  //     const getImportAccount = async () => {
  //       const res = await axios.get(
  //         `${BASE_URL}/input-invoice/input-invoice-summary?pageSize=100&search=${searchQuery}&createdDate=${createdDate}`,
  //         {
  //           headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
  //         }
  //       );
  //       setSearchResults(res.data.inputInvoiceSummary);
  //     };
  //     getImportAccount();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  useEffect(() => {
    getImportAccount();
  }, [parsedUserData?.accessToken]);

  const addInputInvoiceDetails = () => {
    const newDetail: DetailRow = {
      id: id,
      periodFrom: new Date()
        .toLocaleDateString("en-GB", options)
        .replace(/\//g, "-"),
      periodTo: new Date()
        .toLocaleDateString("en-GB", options)
        .replace(/\//g, "-"),
      accountNo: "",
      broker: "",
      profit: "",
      service: calculateService(Number(profit), rate),
      rupiah: Number(0),
    };
    setDetails((prevDetails) => [...prevDetails, newDetail]);
  };

  const options: any = { day: "2-digit", month: "2-digit", year: "numeric" };

  let uuidv4: string;
  uuidv4 = v4();
  const [id] = useState<string>(uuidv4);
  const addDetailRow = () => {
    const newDetail: DetailRow = {
      id: id,
      periodFrom: new Date()
        .toLocaleDateString("en-GB", options)
        .replace(/\//g, "-"),
      periodTo: new Date()
        .toLocaleDateString("en-GB", options)
        .replace(/\//g, "-"),
      accountNo: "",
      broker: "",
      profit: "",
      service: calculateService(Number(profit), rate),
      rupiah: Number(0),
    };
    setDetails((prevDetails) => [...prevDetails, newDetail]);
  };

  const calculateService = (profit: number, rate: number) => {
    return profit * rate;
  };

  const handleImport = async (id: string) => {
    const res = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-summary/${id}`
    );
    if (res.status === 200) {
      const response = await axios.get(
        `${BASE_URL}/input-invoice/input-invoice-details/${res.data.inputInvoiceSummary.no_invoice}`
      );

      const inputInvoiceSummary = res.data.inputInvoiceSummary;
      setClientName(inputInvoiceSummary.client_name);
      setServiceFee(inputInvoiceSummary.service_fee);
      setRate(inputInvoiceSummary.rate);
      setCity(inputInvoiceSummary.city);
      setCountry(inputInvoiceSummary.country);
      setBankName(inputInvoiceSummary.bank_name);
      setBeneficiaryName(inputInvoiceSummary.bank_beneficiary);
      setAccountNumber(inputInvoiceSummary.bank_no);
      setIsImportModalIsVisible(false);
      const newDetails: DetailRow[] = response.data.inputInvoiceDetails?.map(
        (detailsObject: any) => ({
          periodFrom: changeDateFormatAndIncrementHour(
            detailsObject.period_from
          ),
          periodTo: changeDateFormatAndIncrementHour(detailsObject.period_to),
          accountNo: detailsObject.account_no,
          broker: detailsObject.broker_name,
          profit: detailsObject.profit,
          service: detailsObject.service_cost,
          rupiah: detailsObject.cost_in_rupiah,
        })
      );
      setDetails(newDetails);
    }
  };

  const handleImportInvoiceDetails = async (invoiceDetailsId: string) => {
    const res = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-details/${invoiceDetailsId}`
    );
    const inputInvoiceDetailsObject = res.data.inputInvoiceDetails;
    const newDetail: DetailRow = {
      id: id,
      periodFrom: changeDateFormatAndIncrementHour(
        inputInvoiceDetailsObject.period_from
      ),
      periodTo: changeDateFormatAndIncrementHour(
        inputInvoiceDetailsObject.period_to
      ),
      accountNo: inputInvoiceDetailsObject.account_no,
      broker: inputInvoiceDetailsObject.broker_name,
      profit: inputInvoiceDetailsObject.profit,
      service: inputInvoiceDetailsObject.service_cost,
      rupiah: inputInvoiceDetailsObject.cost_in_rupiah,
    };
    setDetails((prevDetails) => [...prevDetails, newDetail]);
    setImportAccountModalVisible(false);
  };

  const handleImportMemberAccounts = async (id: string) => {
    const res = await axios.get(`${BASE_URL}/account/${id}`);
    const memberAccounts = res.data.account;
    const newDetail: DetailRow = {
      id: id,
      periodFrom: new Date()
        .toLocaleDateString("en-GB", options)
        .replace(/\//g, "-"),
      periodTo: new Date()
        .toLocaleDateString("en-GB", options)
        .replace(/\//g, "-"),
      accountNo: memberAccounts.account_no,
      broker: "",
      profit: "",
      service: 0,
      rupiah: 0,
    };
    setDetails((prevDetails) => [...prevDetails, newDetail]);
    setImportMemberAccountModalVisible(false);
  };

  const getMemberAccounts = async () => {
    setLoadingImportMemberAccount(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/input-invoice/account?pageSize=100&search=${memberAccountSearchQuery}&createdDate=${createdDateMemberAccount}&searchBy=${searchMemberAccountByQuery}`,
        { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
      );
      if (res.status === 200) {
        setLoadingImportMemberAccount(false);
      }
      setMemberAccounts(res.data.accounts);
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   setLoadingImportMemberAccount(true);
  //   try {
  //     const getMemberAccounts = async () => {
  //       const res = await axios.get(
  //         `${BASE_URL}/account?pageSize=100&search=${memberAccountSearchQuery}&createdDate=${createdDateMemberAccount}`,
  //         {
  //           headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
  //         }
  //       );
  //       if (res.status === 200) {
  //         setLoadingImportMemberAccount(false);
  //         setMemberAccounts(res.data.accounts);
  //       }
  //     };
  //     getMemberAccounts();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [parsedUserData?.accessToken]);

  useEffect(() => {
    getMemberAccounts();
  }, [parsedUserData?.accessToken]);

  const getInvoiceDetails = async () => {
    setLoadingImportDetails(true);
    try {
      let res = await axios.get(
        `${BASE_URL}/input-invoice/input-invoice-details?search=${invoiceDetailsSearchQuery}&createdDate=${createdDateInvoiceDetails}`,
        { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
      );
      if (res.status === 200) {
        setLoadingImportDetails(false);
        setInvoiceDetailsSearchResults(res.data.inputInvoiceDetails);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   setLoadingImportDetails(true);
  //   try {
  //     const getInvoiceDetails = async () => {
  //       let res = await axios.get(
  //         `${BASE_URL}/input-invoice/input-invoice-details?search=${invoiceDetailsSearchQuery}&createdDate=${createdDateInvoiceDetails}`,
  //         {
  //           headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
  //         }
  //       );
  //       if (res.status === 200) {
  //         setLoadingImportDetails(false);
  //         setInvoiceDetailsSearchResults(res.data.inputInvoiceDetails);
  //       }
  //     };
  //     getInvoiceDetails();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [parsedUserData?.accessToken]);

  useEffect(() => {
    getInvoiceDetails();
  }, [parsedUserData?.accessToken]);

  const handleDetailChange = (
    index: number,
    field: keyof DetailRow,
    value: string
  ) => {
    const updatedDetails = [...details];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setDetails(updatedDetails);
  };
  const removeDetailRow = (index: number) => {
    const updatedDetails = [...details];
    updatedDetails.splice(index, 1);
    setDetails(updatedDetails);
  };

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="dark:bg-[#0e1011] pb-10 ">
      <Navbar user={user} parsedUserData={parsedUserData} />
      {isImportMemberAccountModalVisible ? (
        <ImportMemberAccountModal
          setSearchMemberAccountByQuery={setSearchMemberAccountByQuery}
          setMemberAccountSearchQuery={setMemberAccountSearchQuery}
          setCreatedDateMemberAccount={setCreatedDateMemberAccount}
          getMemberAccount={getMemberAccounts}
          handleImportMemberAccounts={handleImportMemberAccounts}
          memberAccounts={memberAccounts}
          loadingImportMemberAccount={loadingImportMemberAccount}
          setImportMemberAccountModalVisible={
            setImportMemberAccountModalVisible
          }
        />
      ) : null}
      {isSuccessModalVisible ? (
        <SuccessModal
          text="Input invoice has been added successfully"
          redirectLink="/input-invoice"
        />
      ) : null}
      {isImportAccountModalVisible ? (
        <ImportAccountModal
          setImportMemberAccountModalVisible={
            setImportMemberAccountModalVisible
          }
          loadingImportDetails={loadingImportDetails}
          handleImportInvoiceDetails={handleImportInvoiceDetails}
          getInvoiceDetails={getInvoiceDetails}
          setInvoiceDetailsSearchQuery={setInvoiceDetailsSearchQuery}
          invoiceDetailsSearchResults={invoiceDetailsSearchResults}
          setImportAccountModalVisible={setImportAccountModalVisible}
          setCreatedDateInvoiceDetails={setCreatedDateInvoiceDetails}
        />
      ) : null}

      {isImportModalIsVisible ? (
        <ImportModal
          searchResults={searchResults}
          setIsImportModalIsVisible={setIsImportModalIsVisible}
          getImportAccount={getImportAccount}
          parsedUserData={parsedUserData}
          setSearchQuery={setSearchQuery}
          handleImport={handleImport}
          searchMessage={searchMessage}
          setCreatedDate={setCreatedDate}
        />
      ) : null}

      <Summary
        setIsImportModalIsVisible={setIsImportModalIsVisible}
        invoiceNo={invoiceNo}
        date={date}
        clientName={clientName}
        serviceFee={serviceFee}
        rate={rate}
        city={city}
        parsedUserData={parsedUserData}
        country={country}
        setInvoiceNo={setInvoiceNo}
        setDate={setDate}
        setClientName={setClientName}
        setServiceFee={setServiceFee}
        setCity={setCity}
        setCountry={setCountry}
        setRate={setRate}
        setInvoiceNoDate={setInvoiceNoDate}
        invoiceNoDate={invoiceNoDate}
      />
      <TransferTo
        bankName={bankName}
        setBankName={setBankName}
        beneficiaryName={beneficiaryName}
        setBeneficiaryName={setBeneficiaryName}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
      />
      <Detail
        addInputInvoiceDetails={addInputInvoiceDetails}
        user={user}
        setImportAccountModalVisible={setImportAccountModalVisible}
        setIsImportModalIsVisible={setIsImportModalIsVisible}
        setProfit={setProfit}
        rate={rate}
        serviceFee={serviceFee}
        details={details}
        onAddDetailRow={addDetailRow}
        onDetailChange={handleDetailChange}
        onRemoveDetailRow={removeDetailRow}
        setImportMemberAccountModalVisible={setImportMemberAccountModalVisible}
      />

      <InvoiceDocument
        setIsSuccessModalVisible={setIsSuccessModalVisible}
        user={user}
        details={details}
        invoiceNo={invoiceNo}
        date={date}
        clientName={clientName}
        serviceFee={serviceFee}
        rate={rate}
        city={city}
        country={country}
        bankName={bankName}
        beneficiaryName={beneficiaryName}
        setLoading={setLoading}
        accountNumber={accountNumber}
        invoiceNoDate={invoiceNoDate}
        parsedUserData={parsedUserData}
      />
    </div>
  );
};

export default AddInputInvoicePage;
