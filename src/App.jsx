// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import ContractPage from "./pages/ConsensysPage";
import ConsensysPage from "./pages/ConsensysPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/transactions" element={<ChatPage />} />
        <Route path="/consensys" element={<ConsensysPage />} />
        <Route path="/contracts" element={<ContractPage />} />
      </Routes>
    </Router>
  );
}

export default App;
