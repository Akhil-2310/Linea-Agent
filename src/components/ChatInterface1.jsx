// src/components/ChatInterface.jsx
import React, { useState } from "react";
import axios from "axios";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, linea } from "@reown/appkit/networks";
import { ethers } from "ethers";
import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";

// Initialize AppKit
const projectId = "54c238d52f1218087ae00073282addb8";
const networks = [mainnet, linea];
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

function ChatInterface1() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "First Chat", messages: [] },
  ]);
  const [currentConversation, setCurrentConversation] = useState(1);
  const [input, setInput] = useState("");

  const { walletProvider } = useAppKitProvider("eip155");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, user: true };
      setConversations((convs) =>
        convs.map((conv) =>
          conv.id === currentConversation
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );

      try {
        const url = "https://api.brianknows.org/api/v0/agent/transaction";
        const apiKey = "brian_BzdRxFtTa1fdLtisQ"; // Replace with your API key

        const body = {
          prompt: "send 1 usdc to 0x6cc717de21A631e02A425d7fe6138706Bc784197",
          address: " 0x6cc717de21A631e02A425d7fe6138706Bc784197",
          chainId: "59144",
        };

        const response = await axios.post(url, body, {
          headers: {
            "x-brian-api-key": apiKey,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;

        if (data.result && data.result[0].data && data.result[0].data.steps) {
          const transactionStep = data.result[0].data.steps[0];
             const ethersProvider = new BrowserProvider(walletProvider);
             const signer = await ethersProvider.getSigner();


          const txResponse = await signer.sendTransaction({
            to: transactionStep.to,
            value: ethers.BigNumber?.from(transactionStep.value || "0"),
            data: transactionStep.data,
            gasLimit: ethers.BigNumber.from(
              transactionStep.gasLimit || "100000"
            ),
          });

          const receipt = await txResponse.wait();
          const aiResponse = {
            text: `Transaction confirmed: ${receipt.transactionHash}`,
            user: false,
          };

          setConversations((convs) =>
            convs.map((conv) =>
              conv.id === currentConversation
                ? { ...conv, messages: [...conv.messages, aiResponse] }
                : conv
            )
          );
        } else {
          throw new Error("No valid transaction steps found.");
        }
      } catch (error) {
        console.error("Transaction failed:", error);

        if (error.response) {
          console.error("Response Data:", error.response.data);
        }
        const errorMessage = { text: `Error: ${error.message}`, user: false };
        setConversations((convs) =>
          convs.map((conv) =>
            conv.id === currentConversation
              ? { ...conv, messages: [...conv.messages, errorMessage] }
              : conv
          )
        );
      }

      setInput("");
    }
  };

  const startNewChat = () => {
    const newId = conversations.length + 1;
    setConversations([
      ...conversations,
      { id: newId, title: `Chat ${newId}`, messages: [] },
    ]);
    setCurrentConversation(newId);
  };

  const switchConversation = (id) => {
    setCurrentConversation(id);
  };

  const currentMessages =
    conversations.find((conv) => conv.id === currentConversation)?.messages ||
    [];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
        <button
          onClick={startNewChat}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        >
          New Chat
        </button>
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => switchConversation(conv.id)}
              className={`w-full text-left p-2 rounded ${
                conv.id === currentConversation
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              {conv.title}
            </button>
          ))}
        </div>
      </div>
      <appkit-button />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {currentMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.user ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.user ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-700 p-2 rounded-l-lg focus:outline-none"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-500 px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface1;
