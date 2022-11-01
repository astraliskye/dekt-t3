import React from "react";

const Tag = ({ name }: { name: string }) => {
  return <span className="bg-red-700 rounded-md py-1 px-2">{name}</span>;
};

export default Tag;
