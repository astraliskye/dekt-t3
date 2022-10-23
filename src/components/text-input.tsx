import React from "react";

interface TextInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value?: string;
}

const TextInput = ({ onChange, placeholder, value }: TextInputProps) => {
  return (
    <input
      className="rounded-lg px-3 py-1 text-black"
      type="text"
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default TextInput;
