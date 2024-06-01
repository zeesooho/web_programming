import React from 'react';

function Message({ user, text }) {
    return (
        <div className="message">
            <strong>{user} :</strong>
            <span>{text}</span>
        </div>
    );
}

export function MessageList({ messages }) {
    return (
        <div className='messages'>
            <h2>채팅방</h2>
            {messages.map((message, index) => (
                <Message
                    key={index}
                    user={message.user}
                    text={message.text}
                />
            ))}
        </div>
    );
}