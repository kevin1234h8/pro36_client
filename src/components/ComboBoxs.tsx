import React from "react";
import Select from "react-select";

const options = [
  { value: 1, label: "Master" },
  { value: 2, label: "Admin" },
  { value: 3, label: "User" },
];

const ComboBoxs = ({ level, setLevel }: any) => {
  return (
    <div>
      <Select
        value={level}
        options={options}
        className="w-32"
        onChange={(selectedOption) => setLevel(selectedOption)}
      />
    </div>
  );
};

export default ComboBoxs;
