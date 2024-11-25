// src/components/ChatInterface.jsx
import React, { useState } from "react";

function ChatInterface3() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "First Chat", messages: [] },
  ]);
  const [currentConversation, setCurrentConversation] = useState(1);
  const [input, setInput] = useState("");

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

      // API Call to Brian's /knowledge endpoint
      try {
        const response = await fetch(
          "https://api.brianknows.org/api/v0/agent/smart-contract",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-brian-api-key": "brian_BzdRxFtTa1fdLtisQ", // Replace with your API key
            },
            body: JSON.stringify({
              prompt: input,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const aiResponse = {
          text: data.result.contract || "No response available.",
          user: false,
        };

        setConversations((convs) =>
          convs.map((conv) =>
            conv.id === currentConversation
              ? { ...conv, messages: [...conv.messages, aiResponse] }
              : conv
          )
        );
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMessage = {
          text: "Error fetching response. Please try again.",
          user: false,
        };
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
      {/* Sidebar */}
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

      {/* Chat Area */}
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

export default ChatInterface3;
