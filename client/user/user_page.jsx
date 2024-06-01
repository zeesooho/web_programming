import React from 'react';
import socket from '../socket.jsx';

export function UsersList({ users }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('user:join', _userJoined);
        socket.on('user:left', _userLeft);
        // socket.on('change:name', _userChangedName);

        return () => {
            socket.disconnect();
            socket.off('user:join', _userJoined);
            socket.off('user:left', _userLeft);
            // socket.off('change:name', _userChangedName);
        };
    }, []);

    const _userLeft = (data) => {
        const index = users.indexOf(data.name);
        const updatedUsers = [...users];
        updatedUsers.splice(index, 1);
        setUsers(updatedUsers);
    }


    const _userJoined = (data) => {
        setUsers(prevUsers => [...prevUsers, data.name]);
    }

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

    return (
        <div className='users'>
            <h3>참여자들</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        </div>
    );
}
