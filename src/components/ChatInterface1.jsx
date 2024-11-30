import React, { useState } from "react";
import { ethers } from "ethers";

function ChatInterface() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "First Chat", messages: [] },
  ]);
  const [currentConversation, setCurrentConversation] = useState(1);
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && address.trim()) {
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
          prompt: input,
          address: address,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "x-brian-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.result && data.result[0].data && data.result[0].data.steps) {
          const steps = data.result[0].data.steps;

          if (!window.ethereum) {
            throw new Error("MetaMask is not installed.");
          }

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = provider.getSigner();

          for (const step of steps) {
            const txResponse = (await signer).sendTransaction({
              to: step.to,
              value: step.value,
              gasLimit: step.gasLimit,
              data: step.data,
            });

            //const receipt = await txResponse.wait();

            // Append transaction success message
            // const aiResponse = {
            //   text: `Transaction confirmed: ${transactionHash}`,
            //   user: false,
            // };

            const aiResponse = "loading..";

            setTimeout(() => {
              console.log("transaction successful");
            }, 7000);
            setConversations((convs) =>
              convs.map((conv) =>
                conv.id === currentConversation
                  ? { ...conv, messages: [...conv.messages, aiResponse] }
                  : conv
              )
            );
          }
        } else {
          throw new Error("No valid transaction steps found.");
        }
      } catch (error) {
        console.error("Transaction failed:", error);
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
      {/* Sidebar for Chat List */}
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
      {/* Chat Window */}
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
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-700 p-2 rounded-l-lg focus:outline-none m-2"
              placeholder="Type your message..."
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 bg-gray-700 p-2 rounded-l-lg focus:outline-none"
              placeholder="Address"
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

export default ChatInterface;
