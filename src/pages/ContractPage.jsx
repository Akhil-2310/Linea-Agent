// src/pages/ChatPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import ChatInterface3 from "../components/ChatInterface2";

function ContractPage() {
  return (
    <>
      <Navbar />
      <div className="h-screen">
        <ChatInterface3 />
      </div>
    </>
  );
}

export default ContractPage;
