import React from 'react';

function ChatMessage({ message }) {
  return (
    <div style={{
      margin: "0.5rem 0", 
      textAlign: message.sender === 'user' ? 'right' : 'left'
    }}>
      <span>{message.sender === 'user' ? 'You:' : 'Bot:'} {message.text}</span>
    </div>
  );
}

export default ChatMessage;
