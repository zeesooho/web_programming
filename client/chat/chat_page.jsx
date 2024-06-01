import React, { useState, useEffect } from 'react';
import { ChangeNameForm, MessageForm, MessageList } from './chat.jsx';
import socket from '../socket.jsx';

export function ChatPage({ onLogoutSubmit, initUser }) {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(initUser);

    useEffect(() => {
        socket.emit('login', { username: user });
        socket.on('init', _initialize);
        socket.on('send:message', _messageReceive);
        // socket.on('change:name', _userChangedName);

        return () => {
            socket.disconnect();
            socket.off('init', _initialize);
            socket.off('send:message', _messageReceive);
            // socket.off('change:name', _userChangedName);
        };
    }, []);

    const _initialize = (data) => {
        setUser(data.name);
        setUsers(data.users);
    };

    const _messageReceive = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const handleMessageSubmit = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
        socket.emit('send:message', message);
    };

    const handleChangeName = (newName) => {
        const oldName = user;
        socket.emit('change:name', { name: newName }, (result) => {
            if (!result) {
                return alert('There was an error changing your name');
            }
            const index = users.indexOf(oldName);
            const updatedUsers = [...users];
            updatedUsers.splice(index, 1, newName);
            setUsers(updatedUsers);
            setUser(newName);
        });
    };

    const handleLogoutSubmit = () => {
        onLogoutSubmit();
    }

    return (
        <div>
            <div className='center'>
                <ChangeNameForm onChangeName={handleChangeName} />
                <MessageList messages={messages} user={user} />
                <MessageForm onMessageSubmit={handleMessageSubmit} user={user} />
                <button type='button' onClick={handleLogoutSubmit}>로그아웃</button>
            </div>
        </div>
    );
}