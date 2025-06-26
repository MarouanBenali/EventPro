import React, { useState } from "react";
import "./ChatbotWidget.css";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(
        "https://cc86-34-124-180-238.ngrok-free.app/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", 
          },
          body: JSON.stringify({ question }),
        }
      );

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.response || "Pas de réponse.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
         console.error("Erreur détaillée:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Erreur de connexion au serveur." },
      ]);
    }

    setQuestion("");
  };

  return (
    <>
      <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <span>💬 Chat B2B EVANT</span>
          <button onClick={toggleChat}>✖</button>
        </div>

        <div className="chatbot-body">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Tapez votre question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Envoyer</button>
        </div>
      </div>

      <button className="chatbot-toggle-button" onClick={toggleChat}>
        💬
      </button>
    </>
  );
};

export default ChatbotWidget;
