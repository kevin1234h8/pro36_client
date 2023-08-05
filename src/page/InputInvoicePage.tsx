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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Breadcrumb from "../components/Breadcrumb";
import { formatNumberToIDR } from "../utils/numberUtils";
import {
  changeDateFormat,
  changeDateFormatAndIncrementHour,
  formatDateToDDMMYYYY,
  formatShortDateFromYYYYMMDDToDDMMYYYY,
  getFormattedDate,
  getIndonesianFormattedDate,
  getIndonesianFormattedDateUNION,
  incrementHourInISOString,
} from "../utils/dateUtils";

const InputInvoicePage = ({ user, parsedUserData }: any) => {
  const widthStyle = useContainerWidthUtils();
  const [inputDetails, setInputDetails] = useState<InputInvoiceSummary[]>([]);
  const [totalInvoiceSummary, setTotalInvoiceSummary] = useState<number>(1);
  const [invoiceSummaryPage, setInvoiceSummaryPage] = useState<number>(1);
  const [searchInvoiceSummary, setSearchInvoiceSummary] = useState<string>("");
  const [invoiceSummaryPageSize, setInvoiceSummaryPageSize] =
    useState<number>(20);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useLoading();
  // const [inputInvoice, setInputInvoice] = useState<any>();
  const [inputInvoiceDetails, setInputInvoiceDetails] = useState<any>([]);
  const totalPages = Math.ceil(totalInvoiceSummary / invoiceSummaryPageSize);
  // const [loadingInputInvoice, setLoadingInputInvoice] = useState(false);
  useEffect(() => {
    if (inputInvoiceDetails) {
    }
  }, [inputInvoiceDetails]);

  // const getInputInvoice = async (noInvoice: string) => {
  //   const res = await axios.get(
  //     `${BASE_URL}/input-invoice/input-invoice-summary/${noInvoice}`
  //   );
  //   setInputInvoice(res.data.inputInvoiceSummary);
  // };
  // useEffect(() => {
  //   const getInputInvoiceDetails = async () => {

  //   };
  //   getInputInvoiceDetails();
  // }, [inputInvoice?.accountNo]);
  // const getPDFInfo = async (id: string, noInvoice: string) => {
  //   const res = await axios.get(
  //     `${BASE_URL}/input-invoice/input-invoice-summary-details/${id}`
  //   );
  //   setInputInvoice(res.data.inputInvoiceSummary);
  //   console.log("inputInvoice: ", res.data.inputInvoiceSummary);

  //   const inputInvoiceDetailsRes = await axios.get(
  //     `${BASE_URL}/input-invoice/input-invoice-details/${noInvoice}`
  //   );
  //   setInputInvoiceDetails(inputInvoiceDetailsRes.data.inputInvoiceSummary);
  //   console.log("inputInvoiceDetailsRes: ", inputInvoiceDetailsRes.data);
  //   console.log("inputInvoice: ", inputInvoice);
  // };

  const savePDF = async (id: string, noInvoice: string) => {
    setIsLoading(false);
    const res = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-summary-details/${id}`
    );
    const data = res.data.inputInvoiceSummary;
    const inputInvoiceDetailsRes = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-details/${noInvoice}`
    );
    const parts = data.date.split("-");
    // const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const formattedDate = changeDateFormatAndIncrementHour(data.date);
    setInputInvoiceDetails(inputInvoiceDetailsRes.data.inputInvoiceDetails);
    const inputInvoiceDataDetails =
      inputInvoiceDetailsRes.data.inputInvoiceDetails;

    const totalUSDProfit = inputInvoiceDataDetails.reduce(
      (sum: number, detail: any) => {
        const profit = detail.profit.toFixed(2);
        return sum + parseFloat(profit);
      },
      0
    );

    // const totalAmount = inputInvoiceDataDetails.reduce(
    //   (sum: number, detail: any) => {
    //     const amount = detail.cost_in_rupiah
    //       ? detail.cost_in_rupiah
    //       : (detail.profit * (1 - data.service_fee / 100) * data.rate).toFixed(
    //           2
    //         );
    //     return sum + parseFloat(amount);
    //   },
    //   0
    // );

    const totalFee = inputInvoiceDataDetails.reduce(
      (sum: number, detail: any) => {
        // const fee = Number(detail.service) ;
        const fee = detail.service
          ? detail.service
          : (detail.profit * (data.service_fee / 100)).toFixed(2);
        return sum + parseFloat(fee);
      },
      0
    );

    const doc = new jsPDF();
    const startY = 80; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed

    if (data || inputInvoiceDataDetails) {
      const rows = inputInvoiceDataDetails?.map(
        (detail: any, index: number) => [
          index + 1,
          changeDateFormatAndIncrementHour(detail.period_from),
          changeDateFormatAndIncrementHour(detail.period_to),
          detail.account_no,
          detail.broker_name,
          "$" + formatNumberToIDR(parseFloat(detail.profit).toFixed(2)),
          detail.service
            ? "$" + detail.service
            : "$" + (detail.profit * (data.service_fee / 100)).toFixed(2),
          detail.rupiah
            ? "Rp" + detail.rupiah
            : "Rp" +
              parseFloat(
                (
                  parseInt(detail.profit) *
                  (data.service_fee / 100) *
                  data.rate
                ).toFixed(2)
              ).toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                style: "decimal",
                useGrouping: true,
              }),
        ]
      );
      const formattedTotalAmount = formatNumberToIDR(
        parseFloat(data.total_amount).toFixed(2)
      );
      const totalRow = [
        "Total",
        "",
        "",
        "",
        "",
        "$" + formatNumberToIDR(parseFloat(totalUSDProfit).toFixed(2)),
        "$" + formatNumberToIDR(parseFloat(totalFee).toFixed(2)),
        "Rp" + formatNumberToIDR(parseFloat(data.total_amount).toFixed(2)),
      ];
      rows.push(totalRow);
      // Set table properties

      const tableHeaders = datas.inputInvoiceDetailsTableHeaders;
      const tableData = [tableHeaders, ...rows];
      const tableConfig = {
        startY: startY,
        head: [tableHeaders],
        body: rows,
      };
      autoTable(doc, tableConfig);
      const tableHeight = tableData.length * rowHeight;

      doc.setFontSize(10);

      doc.setFont("helvetica", "bold");
      doc.text(data?.client_name || "", 15, 20);
      doc.setTextColor(0, 0, 0); //
      doc.setFont("helvetica", "normal");
      doc.text(data.city, 15, 25);
      doc.text(data.country, 15, 30);

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
      doc.text(data.service_fee + "%", 50, 57);
      doc.text(
        "Rp" + formatNumberToIDR(parseFloat(data.rate).toFixed(2)),
        50,
        64
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Statement Date", 120, 15);
      doc.text("Statement No.", 120, 20);
      doc.setFont("helvetica", "normal");
      doc.text(formattedDate, 170, 15);
      doc.text(data.no_invoice, 170, 20);

      doc.setFont("helvetica", "bold");
      doc.setFillColor(255, 165, 0); // Orange color
      doc.rect(118, 43, 80, 10, "F");
      doc.text("PAYMENT SUMMARY", 120, 50);
      doc.text("Ammount (Rp)", 170, 50);
      doc.text("Total", 120, 57);
      doc.setFont("helvetica", "normal");

      doc.text("Rp" + formattedTotalAmount, 170, 57);
      doc.setFontSize(10);
      doc.text(
        "Payment By Transfer To (Full amount in Rupiah)",
        15,
        startY + tableHeight + 30
      );
      doc.setFont("helvetica", "bold");
      doc.text(data.bank_name, 15, startY + tableHeight + 40);
      doc.text(data.bank_beneficiary, 15, startY + tableHeight + 45);
      doc.text(data.bank_no, 15, startY + tableHeight + 50);

      doc.setFont("helvetica", "italic");

      // Set the underline style

      // Set the font size and text color
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      // Add the text with underline and italic style
      doc.rect(8, startY + tableHeight + 65, 195, 10);
      doc.text(
        "Please make a payment within 7 days after this statement is issued, otherwise the software will be deactivated",
        12,
        startY + tableHeight + 70
      );

      doc.save(`${data.client_name}_invoice_${data.no_invoice}.pdf`);
    }
  };

  const print = async (id: string, noInvoice: string) => {
    setIsLoading(false);
    const res = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-summary-details/${id}`
    );
    const data = res.data.inputInvoiceSummary;
    const inputInvoiceDetailsRes = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-details/${noInvoice}`
    );
    const parts = data.date.split("-");
    // const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const formattedDate = changeDateFormatAndIncrementHour(data.date);
    setInputInvoiceDetails(inputInvoiceDetailsRes.data.inputInvoiceDetails);
    const inputInvoiceDataDetails =
      inputInvoiceDetailsRes.data.inputInvoiceDetails;

    const totalUSDProfit = inputInvoiceDataDetails.reduce(
      (sum: number, detail: any) => {
        const profit = detail.profit.toFixed(2);
        return sum + parseFloat(profit);
      },
      0
    );

    // const totalAmount = inputInvoiceDataDetails.reduce(
    //   (sum: number, detail: any) => {
    //     const amount = detail.cost_in_rupiah
    //       ? detail.cost_in_rupiah
    //       : (detail.profit * (1 - data.service_fee / 100) * data.rate).toFixed(
    //           2
    //         );
    //     return sum + parseFloat(amount);
    //   },
    //   0
    // );

    const totalFee = inputInvoiceDataDetails.reduce(
      (sum: number, detail: any) => {
        // const fee = Number(detail.service) ;
        const fee = detail.service
          ? detail.service
          : (detail.profit * (data.service_fee / 100)).toFixed(2);
        return sum + parseFloat(fee);
      },
      0
    );

    const doc = new jsPDF();
    const startY = 80; // Initial Y-coordinate for the table
    const rowHeight = 10; // Adjust the row height as needed

    if (data || inputInvoiceDataDetails) {
      const rows = inputInvoiceDataDetails?.map(
        (detail: any, index: number) => [
          index + 1,
          changeDateFormatAndIncrementHour(detail.period_from),
          changeDateFormatAndIncrementHour(detail.period_to),
          detail.account_no,
          detail.broker_name,
          "$" + formatNumberToIDR(parseFloat(detail.profit).toFixed(2)),
          detail.service
            ? "$" + detail.service
            : "$" + (detail.profit * (data.service_fee / 100)).toFixed(2),
          detail.rupiah
            ? "Rp" + detail.rupiah
            : "Rp" +
              parseFloat(
                (
                  parseInt(detail.profit) *
                  (data.service_fee / 100) *
                  data.rate
                ).toFixed(2)
              ).toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                style: "decimal",
                useGrouping: true,
              }),
        ]
      );
      const formattedTotalAmount = formatNumberToIDR(
        parseFloat(data.total_amount).toFixed(2)
      );
      const totalRow = [
        "Total",
        "",
        "",
        "",
        "",
        "$" + formatNumberToIDR(parseFloat(totalUSDProfit).toFixed(2)),
        "$" + formatNumberToIDR(parseFloat(totalFee).toFixed(2)),
        "Rp" + formatNumberToIDR(parseFloat(data.total_amount).toFixed(2)),
      ];
      rows.push(totalRow);
      // Set table properties

      const tableHeaders = datas.inputInvoiceDetailsTableHeaders;
      const tableData = [tableHeaders, ...rows];
      const tableConfig = {
        startY: startY,
        head: [tableHeaders],
        body: rows,
      };
      autoTable(doc, tableConfig);
      const tableHeight = tableData.length * rowHeight;

      doc.setFontSize(10);

      doc.setFont("helvetica", "bold");
      doc.text(data?.client_name || "", 15, 20);
      doc.setTextColor(0, 0, 0); //
      doc.setFont("helvetica", "normal");
      doc.text(data.city, 15, 25);
      doc.text(data.country, 15, 30);

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
      doc.text(data.service_fee + "%", 50, 57);
      doc.text(
        "Rp" + formatNumberToIDR(parseFloat(data.rate).toFixed(2)),
        50,
        64
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Statement Date", 120, 15);
      doc.text("Statement No.", 120, 20);
      doc.setFont("helvetica", "normal");
      doc.text(formattedDate, 170, 15);
      doc.text(data.no_invoice, 170, 20);

      doc.setFont("helvetica", "bold");
      doc.setFillColor(255, 165, 0); // Orange color
      doc.rect(118, 43, 80, 10, "F");
      doc.text("PAYMENT SUMMARY", 120, 50);
      doc.text("Ammount (Rp)", 170, 50);
      doc.text("Total", 120, 57);
      doc.setFont("helvetica", "normal");

      doc.text("Rp" + formattedTotalAmount, 170, 57);
      doc.setFontSize(10);
      doc.text(
        "Payment By Transfer To (Full amount in Rupiah)",
        15,
        startY + tableHeight + 30
      );
      doc.setFont("helvetica", "bold");
      doc.text(data.bank_name, 15, startY + tableHeight + 40);
      doc.text(data.bank_beneficiary, 15, startY + tableHeight + 45);
      doc.text(data.bank_no, 15, startY + tableHeight + 50);

      doc.setFont("helvetica", "italic");

      // Set the underline style

      // Set the font size and text color
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      // Add the text with underline and italic style
      doc.rect(8, startY + tableHeight + 65, 195, 10);
      doc.text(
        "Please make a payment within 7 days after this statement is issued, otherwise the software will be deactivated",
        12,
        startY + tableHeight + 70
      );

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    }
  };

  useEffect(() => {
    try {
      const getInputInvoiceDetails = async () => {
        let res = await axios.get(
          `${BASE_URL}/input-invoice/input-invoice-summary`,
          {
            headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
          }
        );

        if (res.status === 200) {
          setIsLoading(false);
        }
        setInputDetails(res.data.inputInvoiceSummary);
        setTotalInvoiceSummary(res.data.totalInvoiceSummary);
      };
      getInputInvoiceDetails();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const getInvoiceSummaryPaginateData = async (
    newPage: number,
    newPageSize: number
  ) => {
    try {
      let res = await axios.get(
        `${BASE_URL}/input-invoice/input-invoice-summary?page=${newPage}&pageSize=${newPageSize}&search=${searchInvoiceSummary}`,
        {
          headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
        }
      );

      if (res.status === 200) {
        setIsLoading(false);
      }
      setInputDetails(res.data.inputInvoiceSummary);
      setTotalInvoiceSummary(res.data.totalInvoiceSummary);
      setInvoiceSummaryPage(newPage);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteInvoiceSummary = async (
    id: string,
    invoiceNo: string | undefined
  ) => {
    try {
      const values: any = {
        deleted_by: user?.id || "",
      };
      const confirmed = window.confirm(
        "Are you sure you want to delete this invoice ?"
      );
      if (confirmed) {
        const deleteInvoiceDetailsRes = await axios.delete(
          `${BASE_URL}/input-invoice/input-invoice-details/${invoiceNo}`
        );
        const res = await axios.delete(
          `${BASE_URL}/input-invoice/input-invoice-summary/${id}/${user.id}/${invoiceNo}`,
          values
        );
        if (res.status === 200 && deleteInvoiceDetailsRes.status === 200) {
          setIsSuccessModalVisible(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const handleSort = (columnName: any) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const sortedAccount = [...inputDetails].sort((a: any, b: any) => {
    if (sortColumn === "No") {
      return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
    } else if (sortColumn === "Invoice Date") {
      const dateA = a.date;
      const dateB = b.date;

      if (dateA < dateB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (dateA > dateB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Invoice No") {
      const noInvoiceA = a.no_invoice;
      const noInvoiceB = b.no_invoice;
      if (noInvoiceA < noInvoiceB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (noInvoiceA > noInvoiceB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Client Name") {
      const clientNameA = a.client_name;
      const clientNameB = b.client_name;
      if (clientNameA < clientNameB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (clientNameA > clientNameB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "City") {
      const cityA = a.city.toUpperCase();
      const cityB = b.city.toUpperCase();
      if (cityA < cityB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (cityA > cityB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Country") {
      const countryA = a.country.toUpperCase();
      const countryB = b.country.toUpperCase();

      if (countryA < countryB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (countryA > countryB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    } else if (sortColumn === "Total (Rp)") {
      const totalAmountA = a.total_amount;
      const totalAmountB = b.total_amount;
      if (totalAmountA < totalAmountB) {
        return sortDirection === "asc" ? -1 : 1;
      } else if (totalAmountA > totalAmountB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  const maxVisibleButtons = 5; // Maximum number of visible page buttons excluding ellipsis
  const ellipsis = "...";
  const halfVisibleButtons = Math.floor(maxVisibleButtons / 2);

  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(
    totalPages > maxVisibleButtons ? maxVisibleButtons : totalPages
  );

  const handlePageClick = (pageNumber: any) => {
    if (pageNumber <= halfVisibleButtons + 1) {
      setStartPage(1);
      setEndPage(
        totalPages > maxVisibleButtons ? maxVisibleButtons : totalPages
      );
    } else if (pageNumber >= totalPages - halfVisibleButtons) {
      setStartPage(totalPages - maxVisibleButtons + 1);
      setEndPage(totalPages);
    } else {
      setStartPage(pageNumber - halfVisibleButtons);
      setEndPage(pageNumber + halfVisibleButtons);
    }

    getInvoiceSummaryPaginateData(pageNumber, invoiceSummaryPageSize);
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
      <Breadcrumb />
      <div className="w-full lg:mx-auto dark:bg-[#0e1011] ">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-4 lg:px-24">
            <h2 className="text-lg font-semibold leading-tight md:text-xl lg:text-2xl dark:text-white">
              Input Invoice
            </h2>
            <button className="add-member-btn">
              <i className="fa-fa-solid add"></i>
              <a
                href={`/add-invoice`}
                className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
              >
                <span className="relative text-xs"> Add Invoice</span>
              </a>
            </button>
          </div>
          <div className="flex flex-col px-4 my-2 sm:flex-row lg:px-24">
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
                placeholder="Search Client Name"
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
              className="dark:bg-[#0e1011] overflow-x-scroll md:overflow-x-hidden lg:overflow-x-hidden md:overflow-y-hidden lg:overflow-y-hidden  px-4 md:px-8 lg:px-24 "
              style={{ width: widthStyle }}
            >
              <div className="row row--top-40"></div>
              <div className="row row--top-20">
                <div className="col-md-12">
                  <div className="table-container  dark:bg-[#0e1011]">
                    <table className="table w-full">
                      <thead className="table__thead dark:bg-[#0e1011] dark:text-white">
                        <tr>
                          {datas.inputInvoiceSummary.map((data, index) => {
                            const columnName = data.name;
                            const isSortableColumn = columnName !== "No";
                            const isSortedColumn = sortColumn === columnName;
                            const sortClass = isSortedColumn
                              ? sortDirection === "asc"
                                ? "fa-solid fa-sort-down"
                                : "fa-solid fa-sort-up"
                              : "";

                            return (
                              <th
                                key={index}
                                className={`text-center table__th dark:text-white ${
                                  !isSortableColumn ? "cursor-default" : ""
                                }`}
                                onClick={() => {
                                  if (isSortableColumn) {
                                    handleSort(columnName);
                                  }
                                }}
                              >
                                {data.name}
                                {isSortableColumn && isSortedColumn && (
                                  <i className={`fa ${sortClass} mx-2`}></i>
                                )}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="table__tbody">
                        {sortedAccount?.map(
                          (details: InputInvoiceSummary, index: number) => {
                            const parts = details.date.split("-");
                            const formattedDate =
                              getIndonesianFormattedDateUNION(details.date);
                            return (
                              <tr
                                key={index}
                                className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                              >
                                <td data-column="No" className="table-row__td">
                                  {index + 1}
                                </td>

                                <td
                                  data-column="CLIENT NAME"
                                  className=" table-row__td"
                                >
                                  <div className="table-row__info">
                                    {changeDateFormatAndIncrementHour(
                                      details.date
                                    )}
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
                                    Rp
                                    {formatNumberToIDR(
                                      details.total_amount.toFixed(2)
                                    )}
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
                                        <i className="fa-solid fa-pen text-[#3fd2ea] cursor-pointer"></i>
                                      </a>
                                      <i
                                        onClick={() =>
                                          deleteInvoiceSummary(
                                            details.id,
                                            details.no_invoice
                                          )
                                        }
                                        className="cursor-pointer fa-solid fa-trash"
                                      ></i>
                                      <i
                                        onClick={() => {
                                          print(details.id, details.no_invoice);
                                        }}
                                        className="fa-solid fa-file-pdf text-[#3fd2ea] cursor-pointer"
                                      ></i>
                                      <i
                                        className="fa-solid fa-download text-[#3fd2ea] cursor-pointer"
                                        onClick={() => {
                                          savePDF(
                                            details.id,
                                            details.no_invoice
                                          );
                                        }}
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
                    {startPage > 2 && (
                      <li key="ellipsis-start">
                        <button
                          onClick={() => handlePageClick(1)}
                          className={`w-10 h-10 pagination-button ${
                            invoiceSummaryPage === 1
                              ? "bg-indigo-600 text-white"
                              : ""
                          } text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100`}
                        >
                          {1}
                        </button>
                        <span className="mx-2 dark:text-white">{ellipsis}</span>
                      </li>
                    )}

                    {Array.from(
                      { length: endPage - startPage + 1 },
                      (_, index) => {
                        const pageNumber = startPage + index;
                        return (
                          <li key={pageNumber}>
                            <button
                              onClick={() => handlePageClick(pageNumber)}
                              className={`w-10 h-10 pagination-button ${
                                invoiceSummaryPage === pageNumber
                                  ? "bg-indigo-600 text-white"
                                  : ""
                              } text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100`}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      }
                    )}

                    {endPage < totalPages && (
                      <li key="ellipsis-end">
                        <span className="mx-2 dark:text-white">{ellipsis}</span>
                        <button
                          onClick={() => handlePageClick(totalPages)}
                          className={`w-10 h-10 pagination-button ${
                            invoiceSummaryPage === totalPages
                              ? "bg-indigo-600 text-white"
                              : ""
                          } text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100`}
                        >
                          {totalPages}
                        </button>
                      </li>
                    )}

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
            <div className="px-5 py-4 lg:mx-auto text-center text-gray-600 bg-gray-100 dark:bg-[#0e1011]">
              <p className="text-xs md:text-base lg:text-xl font-semibold dark:text-[#e4e4e4]">
                No Results Found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputInvoicePage;
