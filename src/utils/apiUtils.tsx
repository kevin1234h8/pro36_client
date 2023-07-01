import axios from "axios";

type SuccessCallback = () => void;

export const deleteInvoiceSummary = async (
  id: string,
  onSuccess: SuccessCallback
) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/input-invoice/input-invoice-summary/${id}`
    );
    console.log(res);
    if (res.status === 200) {
      onSuccess();
    }
  } catch (err) {
    console.log(err);
  }
};
