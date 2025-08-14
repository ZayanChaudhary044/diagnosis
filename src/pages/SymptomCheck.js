// src/pages/SymptomCheck.js
import React from 'react';
import ChatBox from '../components/ChatBox.js';
import { useState } from 'react';

function SymptomCheck() {
   const [chatHistory, setChatHistory] = useState([
     {
       role: "bot", 
       text: "Hey there 👋 How can I help you with your health concerns today?"
     }
   ]);

  return (
    <div>
      <ChatBox 
        chatHistory={chatHistory} 
        setChatHistory={setChatHistory}
      />
    </div>
  );
}

export default SymptomCheck;