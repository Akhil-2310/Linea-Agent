// src/pages/ChatPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import ChatInterface1 from "../components/ChatInterface1";

function ChatPage() {
  return (
    <>
      <Navbar />
      <div className="h-screen">
        <ChatInterface1 />
      </div>
    </>
  );
}

export default ChatPage;
