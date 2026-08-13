import React from "react";

const Input = ({ label, id, name, type, placeholder, label_cls_name, cls_name, value, onChange }) => {
  return (
    <div className="relative mb-4">
      <label
        htmlFor={id}
        className={label_cls_name}
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        name={name}
        className={cls_name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
