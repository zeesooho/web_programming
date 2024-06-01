import React, { useState, useEffect } from 'react';
import { MessageForm, MessageList } from './chat.jsx';

export function ChatPage({ initUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(initUser);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState('');
    const [searchRoom, setSearchRoom] = useState('');
    const [roomExists, setRoomExists] = useState(true);

    const initialize = (data) => {
        setUser(data.name);
    };

    const messageReceive = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const fetchRooms = async () => {
        try {
            const response = await fetch('/api/room/rooms');
            const data = await response.json();
            setRooms(data.rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    useEffect(() => {
        socket.on('init', initialize);
        socket.on('send:message', messageReceive);
        socket.on('room:joined', (data) => {
            setMessages(data.messages);
        });

        fetchRooms();

        return () => {
            socket.off('init', initialize);
            socket.off('send:message', messageReceive);
            socket.off('room:joined');
        };
    }, [socket]);

    const handleMessageSubmit = (message) => {
        const newMessage = { user, text: message, time: Date.now() };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        socket.emit('send:message', { room: currentRoom, text: message, time: newMessage.time });
    };

    const handleJoinRoom = (room) => {
        setMessages([]);
        setCurrentRoom(room);
        socket.emit('room:join', { room });
    };

    const handleSearchRoom = () => {
        if (rooms.includes(searchRoom)) {
            setRoomExists(true);
            handleJoinRoom(searchRoom);
        } else {
            setRoomExists(false);
        }
    };

    const handleCreateRoom = () => {
        if (searchRoom && !rooms.includes(searchRoom)) {
            setRooms([...rooms, searchRoom]);
            handleJoinRoom(searchRoom);
            setSearchRoom('');
            setRoomExists(true);
        }
    };

    return (
        <div className="chat-page">
            <div className='sidebar'>
                <div className='search-bar'>
                    <input
                        type='text'
                        value={searchRoom}
                        onChange={(e) => setSearchRoom(e.target.value)}
                        placeholder='찾을 방'
                    />
                    <button onClick={handleSearchRoom}>🔍</button>
                </div>
                {!roomExists && (
                    <div className="room-not-found">
                        <p>해당 방이 존재하지 않습니다. 방을 개설하시겠습니까?</p>
                        <button onClick={handleCreateRoom}>O</button>
                        <button onClick={() => setRoomExists(true)}>X</button>
                    </div>
                )}
                <ul className="room-list">
                    {rooms.map((room, index) => (
                        <li key={index}>
                            <button onClick={() => handleJoinRoom(room)}>{room}</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='chat-container'>
                <React.Fragment>
                    <h3>{currentRoom ? currentRoom : "채팅방을 선택하세요"}</h3>
                    <MessageList messages={messages} currentUser={user} />
                    <MessageForm onMessageSubmit={handleMessageSubmit} user={user} disabled={!currentRoom} />
                </React.Fragment>
            </div>
        </div>
    );
}
