import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import { goBack } from "../utils/navigationUtils";
import Breadcrumb from "../components/Breadcrumb";
import datas from "../data/datas.json";
import useContainerWidthUtils from "../utils/useContainerWidthUtils";
import { InputInvoiceDetails } from "../interface/InputInvoiceDetailsInterface";
import { formatNumberToIDR } from "../utils/numberUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import { DetailRow } from "../interface/DetailRowInterface";
import ImportAccountModal from "../components/ImportAccountModal";
import ImportMemberAccountModal from "../components/ImportMemberAccountModal";
import ImportModal from "../components/ImportModal";
import {
  convertToDDMMYYYY,
  convertToYYYYMMDD,
  formatShortStringToDDMMYYYY,
  getFormattedDate,
  getIndonesianFormattedDate,
  getIndonesianFormattedDateUNION,
  formatShortDateFromYYYYMMDDToDDMMYYYY,
  formatDateToOriginal,
  formatDateToISO,
  formatShortDateToDDMMYYYY,
  formatShortStringDateToYYYYMMDD,
  changeDateFormatAndIncrementHour,
  changeDateFormatAndIncrementDayToYYYYMMDD,
  changeDateFormatAndNotIncrementDayPlus1ToYYYYMMDD,
  format,
  formatDate,
  reformatDate,
  convertToShortDateFormat,
  addDaysToDate,
  convertToShortDateFormatSwapMonthAndDays,
  changeDateFormatAndNotIncrementHourWithAddedDate,
  formatDateToYYYYMMDD,
} from "../utils/dateUtils";

const EditInvoiceSummaryPage = ({ user, parsedUserData }: any) => {
  // const handleInputChange = (
  //   index: number,
  //   field: keyof DetailRow,
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   onDetailChange(index, field, event.target.value);
  // };
  const widthStyle = useContainerWidthUtils();
  const { id }: any = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [clientName, setClientName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bankName, setBankName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [accountNumber, setAccountNumber] = useState<number>(0);

  const periodFrom = useRef<string>("");
  const periodTo = useRef<string>("");
  const invoiceNoRef = useRef("");
  const dateRef = useRef("");
  const [date, setDate] = useState(dateRef.current);
  const clientNameRef = useRef("");
  const serviceFeeRef = useRef(1);
  const [serviceFee, setServiceFee] = useState<number>(serviceFeeRef.current);
  const rateRef = useRef(1);
  const [rate, setRate] = useState<number>(rateRef.current);
  const cityRef = useRef("");
  const countryRef = useRef("");
  const bankNameRef = useRef("");
  const beneficiaryNameRef = useRef("");
  const accountNumberRef = useRef(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inputInvoiceDetails, setInputInvoiceDetails] = useState<any>([]);
  const [defaultValue, setDefaultValue] = useState<any>([]);
  const [invoiceDetails, setInvoiceDetails] =
    useState<InputInvoiceDetails[]>(inputInvoiceDetails);

  const [memberAccountSearchQuery, setMemberAccountSearchQuery] =
    useState<string>("");
  const [invoiceDetailsSearchResults, setInvoiceDetailsSearchResults] =
    useState<any>([]);

  const [searchMemberAccountByQuery, setSearchMemberAccountByQuery] =
    useState("account_no");
  const [loadingImportMemberAccount, setLoadingImportMemberAccount] =
    useState(false);

  const [details, setDetails] = useState<InputInvoiceDetails[]>([]);
  const parts = dateRef.current.split("-");
  // const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  const formattedDate = changeDateFormatAndNotIncrementHourWithAddedDate(date);
  useEffect(() => {
    const getInvoiceSummary = async () => {
      const res = await axios.get(
        `${BASE_URL}/input-invoice/input-invoice-summary/${id}`
      );
      const inputInvoiceSummary = res.data.inputInvoiceSummary;
      setInvoiceNo(inputInvoiceSummary.no_invoice);
      setDate(
        changeDateFormatAndNotIncrementHourWithAddedDate(
          inputInvoiceSummary.date
        )
      );
      setClientName(inputInvoiceSummary.client_name);
      setServiceFee(inputInvoiceSummary.service_fee);
      setRate(inputInvoiceSummary.rate);
      setCity(inputInvoiceSummary.city);
      setCountry(inputInvoiceSummary.country);
      setBankName(inputInvoiceSummary.bank_name);
      setBeneficiaryName(inputInvoiceSummary.bank_beneficiary);
      setAccountNumber(inputInvoiceSummary.bank_no);

      invoiceNoRef.current = inputInvoiceSummary.no_invoice;
      dateRef.current = inputInvoiceSummary.date;
      clientNameRef.current = inputInvoiceSummary.client_name;
      serviceFeeRef.current = inputInvoiceSummary.service_fee;
      rateRef.current = inputInvoiceSummary.rate;
      cityRef.current = inputInvoiceSummary.city;
      countryRef.current = inputInvoiceSummary.country;
      bankNameRef.current = inputInvoiceSummary.bank_name;
      beneficiaryNameRef.current = inputInvoiceSummary.bank_beneficiary;
      accountNumberRef.current = inputInvoiceSummary.bank_no;
      const getInputInvoiceDetails = async () => {
        const res = await axios.get(
          `${BASE_URL}/input-invoice/input-invoice-details/${inputInvoiceSummary.no_invoice}`,
          {
            headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
          }
        );
        setDefaultValue(res.data.inputInvoiceDetails);
        setInputInvoiceDetails(res.data.inputInvoiceDetails);
        setInvoiceDetails(res.data.inputInvoiceDetails);
      };

      getInputInvoiceDetails();
    };
    setIsLoading(false); // Set loading state to false after data is fetched
    getInvoiceSummary();
  }, [id]);

  const handleAccountNoChange = (index: any, newValue: any) => {
    // Create a new array of invoiceData and update the account_no value based on the index
    const updatedData = invoiceDetails.map((data, i) =>
      i === index ? { ...data, account_no: newValue } : data
    );
    const updatedAddedInvoiceDetails = details.map((data, i) =>
      i === index ? { ...data, account_no: newValue } : data
    );
    // Update the state with the new array of invoiceData
    setDetails(updatedAddedInvoiceDetails);
    setInvoiceDetails(updatedData);
  };

  const handleInputChange = (index: any, field: any, value: any) => {
    const updatedInvoiceDetails = invoiceDetails.map((invoice, i) =>
      i === index ? { ...invoice, [field]: value } : invoice
    );
    const updatedAddedInvoiceDetails = details.map((invoice, i) =>
      i === index ? { ...invoice, [field]: value } : invoice
    );
    setDetails(updatedAddedInvoiceDetails);
    setInvoiceDetails(updatedInvoiceDetails);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setRate(newValue);
  };

  const handleChangeBankAccountNo = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setAccountNumber(newValue);
  };

  const handleChangeServiceFee = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(e.target.value);
    if (newValue > 100) {
      newValue = 100;
    }
    e.target.value = newValue.toString();
    setServiceFee(newValue);
  };

  // const onRemoveDetailRow = (index: number) => {
  //   const updatedDetails = [...invoiceDetails];
  //   const updatedAddedDetails = [...details];
  //   updatedDetails.splice(index, 1);
  //   updatedAddedDetails.splice(index, 1);
  //   setDetails(updatedAddedDetails);
  //   setInvoiceDetails(updatedDetails);
  // };
  const onRemoveDetailRow = (idToRemove: string) => {
    const updatedDetails = invoiceDetails.filter(
      (detail: any) => detail.id !== idToRemove
    );
    setInvoiceDetails(updatedDetails);
  };

  const options: any = { day: "2-digit", month: "2-digit", year: "numeric" };

  const calculateService = (profit: number, rate: number) => {
    return profit * rate;
  };
  useEffect(() => {
    setLoadingImportMemberAccount(true);
    try {
      const getMemberAccounts = async () => {
        const res = await axios.get(
          `${BASE_URL}/input-invoice/account?pageSize=100&search=${memberAccountSearchQuery}&createdDate=${createdDateMemberAccount}`,
          {
            headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
          }
        );
        if (res.status === 200) {
          setLoadingImportMemberAccount(false);
          setMemberAccounts(res.data.accounts);
        }
      };
      getMemberAccounts();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    setLoadingImportDetails(true);
    try {
      const getInvoiceDetails = async () => {
        let res = await axios.get(
          `${BASE_URL}/input-invoice/input-invoice-details?search=${invoiceDetailsSearchQuery}&createdDate=${createdDateInvoiceDetails}`,
          {
            headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
          }
        );
        if (res.status === 200) {
          setLoadingImportDetails(false);
          setInvoiceDetailsSearchResults(res.data.inputInvoiceDetails);
        }
      };
      getInvoiceDetails();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const addInputInvoiceDetails = () => {
    const newDetail: any = {
      id: id,
      no_invoice: invoiceNoRef.current,
      period_from: convertToDDMMYYYY(
        new Date().toLocaleDateString("en-GB", options).replace(/\//g, "-")
      ),
      period_to: convertToDDMMYYYY(
        new Date().toLocaleDateString("en-GB", options).replace(/\//g, "-")
      ),
      account_no: "",
      broker_name: "",
      profit: "",
      service: Number(0),
      rupiah: Number(0),
    };
    setDetails((prevDetails: any) => [...prevDetails, newDetail]);
    setInvoiceDetails((prevDetails: any) => [...prevDetails, newDetail]);
  };
  const [isImportModalIsVisible, setIsImportModalIsVisible] = useState(false);
  const [isImportAccountModalVisible, setImportAccountModalVisible] =
    useState<boolean>(false);

  const [
    isImportMemberAccountModalVisible,
    setIsImportMemberAccountModalVisible,
  ] = useState<boolean>(false);

  const [createdDateMemberAccount, setCreatedDateMemberAccount] =
    useState<string>("");

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

  const handleImportMemberAccounts = async (id: string) => {
    const res = await axios.get(`${BASE_URL}/account/${id}`);
    const memberAccounts = res.data.account;
    const newDetail: any = {
      id: id,
      no_invoice: invoiceNoRef.current,
      period_from: convertToDDMMYYYY(
        new Date().toLocaleDateString("en-GB", options).replace(/\//g, "-")
      ),
      period_to: convertToDDMMYYYY(
        new Date().toLocaleDateString("en-GB", options).replace(/\//g, "-")
      ),
      account_no: memberAccounts.account_no,
      broker_name: "",
      profit: "",
      service: 0,
      rupiah: 0,
    };

    setDetails((prevDetails: any) => [...prevDetails, newDetail]);
    setInvoiceDetails((prevDetails: any) => [...prevDetails, newDetail]);
    setIsImportMemberAccountModalVisible(false);
  };

  const addDetails = invoiceDetails.filter(
    (item2: any) => !defaultValue.some((item1: any) => item1.id === item2.id)
  );
  const removedDetails = defaultValue.filter(
    (item1: any) => !invoiceDetails.some((item2: any) => item2.id === item1.id)
  );
  const [memberAccounts, setMemberAccounts] = useState<any>([]);

  const [loadingImportDetails, setLoadingImportDetails] = useState(false);

  function formatShortDateToDDMMYYYYasd(dateString: any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const handleImportInvoiceDetails = async (invoiceDetailsId: string) => {
    const res = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-details/${invoiceDetailsId}`
    );
    const inputInvoiceDetailsObject = res.data.inputInvoiceDetails;
    const newDetail: any = {
      id: id,
      no_invoice: invoiceNoRef.current,
      period_from: changeDateFormatAndIncrementDayToYYYYMMDD(
        inputInvoiceDetailsObject.period_from
      ),
      period_to: changeDateFormatAndIncrementDayToYYYYMMDD(
        inputInvoiceDetailsObject.period_to
      ),
      account_no: inputInvoiceDetailsObject.account_no,
      broker_name: inputInvoiceDetailsObject.broker_name,
      profit: inputInvoiceDetailsObject.profit,
      service_cost: inputInvoiceDetailsObject.service_cost,
      cost_in_rupiah: inputInvoiceDetailsObject.cost_in_rupiah,
    };
    setDetails((prevDetails: any) => [...prevDetails, newDetail]);
    setInvoiceDetails((prevDetails: any) => [...prevDetails, newDetail]);
    setImportAccountModalVisible(false);
  };
  const [invoiceDetailsSearchQuery, setInvoiceDetailsSearchQuery] =
    useState<string>("");

  const [createdDateInvoiceDetails, setCreatedDateInvoiceDetails] =
    useState<string>("");

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

  const values = {
    periodFrom: periodFrom.current,
    periodTo: periodTo.current,
    clientName: clientNameRef.current,
    serviceFee: serviceFee,
    rate: rate,
    city: cityRef.current,
    country: countryRef.current,
    bankName: bankNameRef.current,
    beneficiaryName: beneficiaryNameRef.current,
    bankNo: accountNumber,
    modifiedBy: user.id,
  };

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [createdDate, setCreatedDate] = useState<string>("");

  const getImportAccount = async () => {
    const res = await axios.get(
      `${BASE_URL}/input-invoice/input-invoice-summary?pageSize=100&search=${searchQuery}&createdDate=${createdDate}`,
      { headers: { Authorization: "Bearer " + parsedUserData?.accessToken } }
    );
    setSearchResults(res.data.inputInvoiceSummary);
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
      const newDetails: any = response.data.inputInvoiceSummary?.map(
        (detailsObject: any) => ({
          periodFrom: detailsObject.period_from,
          periodTo: detailsObject.period_to,
          accountNo: detailsObject.account_no,
          broker: "",
          profit: detailsObject.profit,
          service: detailsObject.service_cost,
          rupiah: detailsObject.cost_in_rupiah,
        })
      );
      setInvoiceDetails(newDetails);
    }
  };
  const [searchMessage, setSearchMessage] = useState("");
  const format1Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  const format2Regex = /^\d{2}-\d{2}-\d{4}$/;

  function formatDate(input: any) {
    console.log(input);
    console.log(format1Regex.test(input));
    console.log(format2Regex.test(input));
    if (format1Regex.test(input)) {
      console.log(addDaysToDate(input));
      return addDaysToDate(input);
    } else if (format2Regex.test(input)) {
      return convertToShortDateFormatSwapMonthAndDays(input);
    } else {
      return input;
    }
  }

  const handleUpdate = async (id: string, invoiceNo: string) => {
    setLoading(true);
    try {
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Regular expression to match dd-mm-yyyy format

      // if (!dateRegex.test(formattedDate)) {
      //   alert(
      //     "Invalid regist date or expired date  format , Please use the format dd-mm-yyyy. For example, 17-05-2023."
      //   );
      //   return;
      // }
      const totalAmount = invoiceDetails.reduce((sum: number, detail: any) => {
        const amount = detail.rupiah
          ? detail.rupiah
          : (detail.profit * (serviceFee / 100) * rate).toFixed(2);
        return sum + parseFloat(amount);
      }, 0);

      const values = {
        periodFrom: periodFrom.current,
        periodTo: periodTo.current,
        date: convertToYYYYMMDD(date),
        clientName: clientNameRef.current,
        serviceFee: serviceFee,
        rate: rate,
        city: cityRef.current,
        country: countryRef.current,
        bankName: bankNameRef.current,
        beneficiaryName: beneficiaryNameRef.current,
        bankNo: accountNumber,
        totalAmount: totalAmount,
        modifiedBy: user.id,
      };

      const res = await axios.put(
        `${BASE_URL}/input-invoice/input-invoice-summary/${id}/${invoiceNo}`,
        values
      );

      // const hasInvalidDate = invoiceDetails?.some(
      //   (detail: any) =>
      //     !dateRegex.test(
      //       changeDateFormatAndIncrementHour(detail.period_from)
      //     ) ||
      //     !dateRegex.test(changeDateFormatAndIncrementHour(detail.period_to))
      // );
      // if (hasInvalidDate) {
      //   setLoading(false);
      //   alert(
      //     "Invalid period from or period to date format, please use the format dd-mm-yyyy. For example, 17-05-2023."
      //   );
      //   return;
      // }

      const inputInvoiceDetailsData = invoiceDetails?.map(
        (detail: any, index: number) => {
          return [
            formatDate(detail.period_from),
            formatDate(detail.period_to),
            parseInt(detail.account_no),
            detail.broker_name,
            parseFloat(detail.profit),
            parseFloat(
              (detail.profit * (serviceFeeRef.current / 100)).toFixed(2)
            ),
            parseFloat(
              (detail.profit * (serviceFeeRef.current / 100) * rate).toFixed(2)
            ),
            user?.id,
            detail.id,
          ];
        }
      );

      if (removedDetails.length > 0) {
        const removeInputInvoiceDetailsData = removedDetails?.map(
          (detail: any, index: number) => {
            return detail.id;
          }
        );
        const deleteInvoiceDetailsRes = await axios.post(
          `${BASE_URL}/input-invoice/input-invoice-details/delete-invoice-details`,
          { data: removeInputInvoiceDetailsData },
          {
            headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
          }
        );
      }

      if (inputInvoiceDetails.length > 0) {
        const inputInvoiceDetailsRes = await axios.put(
          `${BASE_URL}/input-invoice/input-invoice-details/${invoiceNo}`,
          { data: inputInvoiceDetailsData }
        );
      }

      const addDetailsValues = addDetails?.map((detail: any, index: number) => [
        detail.no_invoice,
        formatDate(detail.period_from),
        formatDate(detail.period_to),
        parseInt(detail.account_no) || "",
        detail.broker_name,
        parseFloat(detail.profit) || "",
        parseFloat((detail.profit * (serviceFeeRef.current / 100)).toFixed(2)),
        parseFloat(
          (detail.profit * (serviceFeeRef.current / 100) * rate).toFixed(2)
        ),
        user?.id,
        user?.id,
      ]);
      //   const addDetailsValues = inputInvoiceDetailsData.some((item) =>
      //   item.some(
      //     (component) =>
      //       component === null || component === undefined || component === ""
      //   )
      // );

      // if (hasEmptyOrNullComponent) {
      //   alert("please fill all of the field in invoice details.");
      //   setLoading(false);
      //   return;
      // } else {
      //   // Your code when all components are not empty or null
      // }

      if (addDetailsValues.length > 0) {
        const invoiceDetailsCreateRes = await axios.post(
          `${BASE_URL}/input-invoice/input-invoice-details/create`,
          { values: addDetailsValues },
          {
            headers: { Authorization: "Bearer " + parsedUserData?.accessToken },
          }
        );
      }
      if (res.status === 200) {
        setLoading(false);
        setIsSuccessModalVisible(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const changeDateFormatAndNotIncrementHourWithAddedDateFunction = (
    originalDate: any
  ) => {
    const updatedDate = new Date(originalDate);
    // Increment the hour by one
    updatedDate.setUTCHours(updatedDate.getHours() + 7);

    // Format the updated date in the desired format
    const year: any = updatedDate.getFullYear();
    const month: any = String(updatedDate.getMonth() + 1).padStart(2, "0");
    const day: any = String(updatedDate.getDate()).padStart(2, "0");
    const outputDate = `${day}-${month}-${year}`;
    return outputDate;
  };
  return loading ? (
    <LoadingSpinner />
  ) : (
    <div>
      <div className="dark:bg-[#0e1011] pb-10">
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
              setIsImportMemberAccountModalVisible
            }
          />
        ) : null}
        {isImportAccountModalVisible ? (
          <ImportAccountModal
            setImportMemberAccountModalVisible={
              setIsImportMemberAccountModalVisible
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
            setSearchQuery={setSearchQuery}
            handleImport={handleImport}
            searchMessage={searchMessage}
            setCreatedDate={setCreatedDate}
          />
        ) : null}

        <div className="dark:bg-[#0e1011]  h-full">
          {isSuccessModalVisible ? (
            <SuccessModal
              text={`invoice updated successfully`}
              redirectLink={`/input-invoice`}
            />
          ) : null}
          <Navbar user={user} parsedUserData={parsedUserData} />
          <Breadcrumb />
          <div className="add-member-container lg:mx-[10rem] dark:text-white   ">
            <div className="add-member-form w-100">
              <h2 className="font-medium add-member-form-title">
                Edit Invoice Summary
              </h2>
              <form className="form">
                <div className="w-full">
                  <div className="input-box">
                    <input
                      type="text"
                      // value={invoiceNo}
                      value={invoiceNoRef.current}
                      name=""
                      required
                      readOnly
                    />
                    <label>No Invoice</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="text"
                      defaultValue={date}
                      name=""
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                    <label>Date</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="text"
                      defaultValue={clientNameRef.current}
                      name=""
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        (clientNameRef.current = e.target.value)
                      }
                    />
                    <label>Client Name</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="number"
                      value={serviceFee}
                      defaultValue={serviceFeeRef.current}
                      name=""
                      required
                      min={1}
                      max={100}
                      onChange={handleChangeServiceFee}
                      // onChange={(e) => setServiceFee(parseInt(e.target.value))}
                    />
                    <label>Service Fee (%)</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="number"
                      value={rate}
                      defaultValue={rateRef.current}
                      name=""
                      required
                      min={1}
                      onChange={handleChange}
                    />
                    <label>Rate</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="text"
                      defaultValue={cityRef.current}
                      name=""
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        (cityRef.current = e.target.value)
                      }
                    />
                    <label>City</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="text"
                      defaultValue={countryRef.current}
                      name=""
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        (countryRef.current = e.target.value)
                      }
                    />
                    <label>Country</label>
                  </div>
                </div>
                <div className="w-full">
                  <div className="input-box">
                    <input
                      value={bankNameRef.current}
                      type="text"
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        (bankNameRef.current = e.target.value)
                      }
                    />
                    <label>Bank Name</label>
                  </div>
                  <div className="input-box">
                    <input
                      id="RegistDate"
                      defaultValue={beneficiaryNameRef.current}
                      type="text"
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        (beneficiaryNameRef.current = e.target.value)
                      }
                    />
                    <label>Bank Beneficiary Name</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="number"
                      name=""
                      value={accountNumber}
                      defaultValue={accountNumberRef.current}
                      required
                      min={1}
                      onChange={handleChangeBankAccountNo}
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
          <div className="flex justify-between w-full gap-4 px-4 md:justify-end lg:justify-end lg:px-20">
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
                onClick={() => setIsImportMemberAccountModalVisible(true)}
                className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative text-xs">Import Account</span>
              </button>
            )}
          </div>
          <div
            className={`lg:w-full  overflow-x-scroll  lg:overflow-x-hidden  px-4 md:px-8 lg:px-8  dark:bg-[#0e1011] `}
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
                      {invoiceDetails?.map((detail: any, index: number) => {
                        return (
                          <tr
                            key={detail.id}
                            className="table-row border-b border-b-[#e4e9ea] text-black dark:text-[#c6c8ca] dark:bg-[#0e1011] dark:border-b dark:border-b-[#202125]"
                          >
                            <td data-column="No" className="table-row__td">
                              {index + 1}
                            </td>
                            <td
                              data-column="Account No"
                              className="table-row__td"
                            >
                              <p className="flex items-center justify-center gap-2">
                                <input
                                  type="text"
                                  className="text-center  dark:text-[hsl(225,2%,64%)] border-none appearance-none cursor-pointer  dark:bg-[#0e1011] "
                                  min={1}
                                  defaultValue={changeDateFormatAndNotIncrementHourWithAddedDate(
                                    detail.period_from
                                  )}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "period_from",
                                      e.target.value
                                    )
                                  }
                                />
                              </p>
                            </td>
                            <td
                              data-column="Account No"
                              className="table-row__td"
                            >
                              <p className="flex items-center justify-center gap-2">
                                <input
                                  type="text"
                                  className="text-center  dark:text-[#a0a1a4] border-none appearance-none cursor-pointer  dark:bg-[#0e1011] "
                                  min={1}
                                  defaultValue={changeDateFormatAndNotIncrementHourWithAddedDate(
                                    detail.period_to
                                  )}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "period_to",
                                      e.target.value
                                    )
                                  }
                                />
                              </p>
                            </td>
                            {/* <td
                              data-column="Period To"
                              className="table-row__td "
                            >
                              <div className="table-row__info">
                                <p className="table-row__name  dark:text-[#a0a1a4] w-[100px]">
                                  {detail.period_from}
                                </p>
                              </div>
                            </td> */}
                            {/* <td
                              data-column="Period From"
                              className="table-row__td "
                            >
                              <div className="table-row__info w-[100px]">
                                <p className="text-center  dark:text-[#a0a1a4] table-row__name ">
                                  {detail.period_to}
                                </p>
                              </div>
                            </td> */}
                            <td
                              data-column="Account No"
                              className="table-row__td"
                            >
                              <p className="flex items-center justify-center gap-2">
                                <input
                                  type="number"
                                  className="text-center  dark:text-[#a0a1a4] border-none appearance-none cursor-pointer  dark:bg-[#0e1011] "
                                  // placeholder="0"
                                  min={1}
                                  defaultValue={detail.account_no}
                                  onChange={(e) =>
                                    handleAccountNoChange(index, e.target.value)
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
                                  className="text-center  dark:bg-[#0e1011]   dark:text-[#a0a1a4]  cursor-pointer "
                                  type="text"
                                  defaultValue={detail.broker_name}
                                  placeholder=""
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "broker_name",
                                      e.target.value
                                    )
                                  }
                                />
                              </p>
                            </td>
                            <td data-column="Profit" className="table-row__td ">
                              <p className="flex items-center justify-center ">
                                <input
                                  className="text-center  dark:bg-[#0e1011]  dark:text-[#a0a1a4]  cursor-pointer "
                                  type="number"
                                  // placeholder="0"
                                  defaultValue={detail.profit}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "profit",
                                      e.target.value
                                    )
                                  }
                                />
                              </p>
                            </td>

                            <td data-column="Service" className="table-row__td">
                              <p className="flex items-center justify-center  dark:text-[#a0a1a4] ">
                                {detail.service_cost === 0
                                  ? (
                                      detail.profit *
                                      (serviceFee / 100)
                                    ).toFixed(2)
                                  : (
                                      detail.profit *
                                      (serviceFee / 100)
                                    ).toFixed(2)}
                              </p>
                            </td>

                            <td data-column="Rupiah" className="table-row__td">
                              {detail.rupiah === 0
                                ? formatNumberToIDR(
                                    (
                                      detail.profit *
                                      (serviceFee / 100) *
                                      rate
                                    ).toFixed(2)
                                  )
                                : formatNumberToIDR(
                                    (
                                      detail.profit *
                                      (serviceFee / 100) *
                                      rate
                                    ).toFixed(2)
                                  )}
                            </td>
                            <td data-column="Action" className="table-row__td">
                              <i
                                onClick={() => onRemoveDetailRow(detail.id)}
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
        </div>
        <div className="my-14 form-footer">
          <div
            onClick={() => handleUpdate(id, invoiceNo)}
            className=" cursor-pointer rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative text-xs">Save</span>
          </div>
          <div
            onClick={goBack}
            className="cursor-pointer  rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
          >
            <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
            <span className="relative text-xs">Cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceSummaryPage;
