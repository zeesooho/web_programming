import React, { useState } from 'react';

export function MessageForm({ onMessageSubmit, user, disabled }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onMessageSubmit(message);
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="message_form">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
                disabled={disabled}
            />
            <button type="submit" disabled={disabled || !message}>Send</button>
        </form>
    );
}