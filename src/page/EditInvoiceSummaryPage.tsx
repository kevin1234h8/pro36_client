import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import { BASE_URL } from "../config/config";
import { goBack } from "../utils/navigationUtils";

const EditInvoiceSummaryPage = ({ user }: any) => {
  const { id }: any = useParams();
  const [isSuccessModalVisible, setIsSuccessModalVisible] =
    useState<boolean>(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [serviceFee, setServiceFee] = useState<number>(1);
  const [rate, setRate] = useState<number>(1);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bankName, setBankName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [accountNumber, setAccountNumber] = useState<number>(1);

  const invoiceNoRef = useRef("");
  const dateRef = useRef("");
  const clientNameRef = useRef("");
  const serviceFeeRef = useRef(1);
  const rateRef = useRef(1);
  const cityRef = useRef("");
  const countryRef = useRef("");
  const bankNameRef = useRef("");
  const beneficiaryNameRef = useRef("");
  const accountNumberRef = useRef(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const getInvoiceSummary = async () => {
      const res = await axios.get(
        `${BASE_URL}/input-invoice/input-invoice-summary/${id}`
      );
      const inputInvoiceSummary = res.data.inputInvoiceSummary;
      setInvoiceNo(inputInvoiceSummary.invoiceNo);
      setDate(inputInvoiceSummary.date);
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
    };
    setIsLoading(false); // Set loading state to false after data is fetched
    getInvoiceSummary();
  }, [id]);

  const handleUpdate = async (id: string) => {
    try {
      const values = {
        clientName: clientNameRef.current,
        serviceFee: serviceFeeRef.current,
        rate: rateRef.current,
        city: cityRef.current,
        country: countryRef.current,
        bankName: bankNameRef.current,
        beneficiaryName: beneficiaryNameRef.current,
        bankNo: accountNumberRef.current,
        modifiedBy: user.id,
      };
      const res = await axios.put(
        `${BASE_URL}/input-invoice/input-invoice-summary/${id}`,
        values
      );
      if (res.status === 200) {
        setIsSuccessModalVisible(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dark:bg-[#0e1011]  ">
      {isSuccessModalVisible ? (
        <SuccessModal
          text={`invoice updated successfully`}
          redirectLink={`/input-invoice`}
        />
      ) : null}
      <Navbar user={user} />
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
                  value={dateRef.current}
                  name=""
                  required
                  readOnly
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
                  value={serviceFeeRef.current}
                  name=""
                  required
                  min={1}
                  max={100}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    (serviceFeeRef.current = parseInt(e.target.value))
                  }
                  // onChange={(e) => setServiceFee(parseInt(e.target.value))}
                />
                <label>Service Fee</label>
              </div>
              <div className="input-box">
                <input
                  type="number"
                  defaultValue={rateRef.current}
                  name=""
                  required
                  min={1}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    (rateRef.current = parseInt(e.target.value))
                  }
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
                  defaultValue={accountNumberRef.current}
                  required
                  min={1}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    (accountNumberRef.current = parseInt(e.target.value))
                  }
                />
                <label>Bank Account No</label>
              </div>
            </div>
          </form>
          <div className="form-footer">
            <div
              onClick={() => handleUpdate(id)}
              className=" rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative text-xs">Save</span>
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

export default EditInvoiceSummaryPage;
