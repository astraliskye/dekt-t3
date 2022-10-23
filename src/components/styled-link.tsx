import React from "react";

interface StyledLinkProps {
  children: React.ReactNode;
}

const StyledLink = ({ children }: StyledLinkProps) => {
  return <a className="bg-red-700 rounded-lg px-3 py-2">{children}</a>;
};

export default StyledLink;
