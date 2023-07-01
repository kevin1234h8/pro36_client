import React from "react";
import "../scss/addbutton.css";

type Props = {
  text: string;
};
const AddButton = ({ text }: Props) => {
  return (
    <div>
      <button className="custom-btn btn-3">
        <a href="/add-member">{text}</a>
      </button>
    </div>
  );
};

export default AddButton;
