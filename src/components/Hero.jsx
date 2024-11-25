// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="bg-gray-900 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-8xl font-bold mb-4">Welcome to AI agent for Linea</h1>
        <p className="text-5xl mb-8">
          Experience the power of AI + Web3
        </p>
        <p className="text-3xl mb-8">
          Want to do transactions, get info about what consensys does or want to write smart contracts? Do all this in natural language and just one click !!
        </p>
        <Link
          to="/chat"
          className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full text-lg font-semibold"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Hero;
