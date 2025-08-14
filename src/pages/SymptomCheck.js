// src/pages/SymptomCheck.js
import React from 'react';
import ChatBox from '../components/ChatBox.js';

function SymptomCheck() {
  return (
    <div>
      <h2>Symptom Checker</h2>
      <p style={{ marginLeft: '20px'}}>Enter your symptoms to begin diagnosis.</p>
      <ChatBox />
    </div>
  );
}

export default SymptomCheck;
