import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div style={{
      all: 'unset',  
      display: 'block',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f4f4f4', 
      color: '#222' 
    }}>
      {children}
    </div>
  );
};


export default DashboardLayout;
