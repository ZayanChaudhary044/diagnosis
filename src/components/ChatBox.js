import '../chatbox.css';
import { useRef, useState } from 'react';

const ChatBox = ({ chatHistory, setChatHistory }) => {
  const inpRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  // Format AI responses (you can keep your existing function if you want)
  const formatAIResponse = (text) => text.replace(/\n/g, "<br>");

  const generateResponse = async (userMessage) => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        return "I'm having trouble processing your request. Please try again.";
      }

      return data.text;
    } catch (err) {
      return "I'm having network issues. Please try again later.";
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userMessage = inpRef.current.value.trim();
    if (!userMessage) return;

    inpRef.current.value = "";

    setChatHistory((h) => [...h, { role: "user", text: userMessage }]);
    setIsLoading(true);

    setChatHistory((h) => [...h, { role: "bot", text: "typing", isTyping: true }]);

    const aiResponse = await generateResponse(userMessage);

    setChatHistory((h) => {
      const updated = h.filter((msg) => !msg.isTyping);
      return [...updated, { role: "bot", text: aiResponse }];
    });

    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Your Virtual AI Health Check</h1>
      </div>

      <div className="chat-body">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`message ${msg.role}-message`}>
            {msg.isTyping ? (
              <div className="typing-indicator">
                <span>AI is thinking</span>
                <div className="typing-dots"><span></span><span></span><span></span></div>
              </div>
            ) : (
              <div
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.text) }}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="chat-footer">
        <form onSubmit={handleFormSubmit} className="chat-form">
          <input
            ref={inpRef}
            type="text"
            placeholder="Describe your symptoms or health concerns..."
            disabled={isLoading}
            required
            className="message-input"
          />
          <button type="submit" disabled={isLoading} className="material-symbols-outlined">
            {isLoading ? "hourglass_empty" : "arrow_upward"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
