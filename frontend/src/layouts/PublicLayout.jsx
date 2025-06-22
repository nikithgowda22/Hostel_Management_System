
import React from "react";
import Navbar from "../components/Navbar";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default PublicLayout;
