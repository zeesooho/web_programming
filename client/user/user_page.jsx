import React, { useState, useEffect } from 'react';

export function UserPage({ initUser, socket }) {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(initUser);

    const userLeft = (data) => {
        setUsers((prevUsers) => prevUsers.filter((username) => username !== data.name));
    };

    const userJoined = (data) => {
        setUsers((prevUsers) => [...prevUsers, data.name]);
    };

    useEffect(() => {
        socket.emit('getUsers');
        socket.on('users', (userList) => {
            setUsers(userList);
        });

        socket.on('user:join', userJoined);
        socket.on('user:left', userLeft);

        return () => {
            socket.off('user:join', userJoined);
            socket.off('user:left', userLeft);
            socket.off('users', (userList) => {
                setUsers(userList);
            });
        };
    }, [socket]);

    const handleChangeName = (newName) => {
        socket.emit('change:name', { name: newName }, (result) => {
            if (!result) {
                return alert('There was an error changing your name');
            }
            setUsers((prevUsers) => prevUsers.map((username) => (username === user ? newName : username)));
            setUser(newName);
        });
    };

    return (
        <div className='users-page'>
            <h3>참여자들</h3>
            <ul className='user-list'>
                {users.map((username, index) => (
                    <li key={index}>{username}</li>
                ))}
            </ul>
        </div>
    );
}
