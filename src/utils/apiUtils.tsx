import axios from "axios";
import { BASE_URL } from "../config/config";

type SuccessCallback = () => void;

export const deleteInvoiceSummary = async (
  id: string,
  onSuccess: SuccessCallback
) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/input-invoice/input-invoice-summary/${id}`
    );
    console.log(res);
    if (res.status === 200) {
      onSuccess();
    }
  } catch (err) {
    console.log(err);
  }
};
