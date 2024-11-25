// src/pages/ChatPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import ChatInterface2 from "../components/ChatInterface2";

function ConsensysPage() {
  return (
    <>
      <Navbar />
      <div className="h-screen">
        <ChatInterface2 />
      </div>
    </>
  );
}

export default ConsensysPage;
