import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  submit?: boolean;
}

const Button = ({ children, onClick, submit }: ButtonProps) => {
  return (
    <button
      className="rounded-lg border border-white px-3 py-1"
      onClick={onClick}
      type={submit ? "submit" : "button"}
    >
      {children}
    </button>
  );
};

export default Button;
