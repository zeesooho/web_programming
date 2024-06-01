import React from 'react';

function Message({ user, text, time, isOwnMessage }) {
    return (
        <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
            <div className="message-content">
                <strong>{user}</strong>
                <div className="message-text">{text}</div>
                <span className="message-time">{new Date(time).toLocaleTimeString()}</span>
            </div>
        </div>
    );
}

export function MessageList({ messages, currentUser }) {
    return (
        <div className='messages'>
            {messages.map((message, index) => (
                <Message
                    key={index}
                    user={message.user}
                    text={message.text}
                    time={message.time}
                    isOwnMessage={message.user === currentUser}
                />
            ))}
        </div>
    );
}
