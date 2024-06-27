import React, { InputHTMLAttributes } from "react";

export interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerStyle?: string;
  inputStyle?: string;
  labelStyle?: string;
  label: string;
  icon?: JSX.Element;
}

const TextInput: React.FC<ITextInputProps> = ({
  containerStyle,
  inputStyle,
  labelStyle,
  label,
  type,
  value,
  icon,
  onChange,
}) => {
  return (
    <div className={`relative w-full ${containerStyle} rounded-lg`}>
      <p
        className={`absolute -top-3 left-4 bg-white px-2 text-base text-gray-400 font-extralight ${labelStyle}`}
      >
        {label}
      </p>
      <div>
        <input
          type={type}
          className={`border p-3 rounded-lg w-full focus:outline-red-600 ${inputStyle}`}
          value={value}
          onChange={onChange}
        />
        {icon && <div className="absolute top-3 right-3">{icon}</div>}
      </div>
    </div>
  );
};

export default TextInput;
