import React from 'react';


const ChatMessage = ({ message, role }) => {
    return(
        <div className={`message ${role === 'user' ? 'user-message' : 'bot-message'}`}>
            <p className="message-text">
                {message}
            </p>
        </div>
    );
}

export default ChatMessage;