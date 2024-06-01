const { getUser } = require('./users');
const {
    createRoom,
    addMessageToRoom,
    getRoomInfo
} = require('./rooms');

let connectedUsers = {};

const getConnectNames = () => {
    return Object.keys(connectedUsers);
};

const handleSocket = function (socket) {
    socket.on('login', (data) => {
        const user = getUser(data.username);
        if (!user) {
            return socket.emit('error', { message: '사용자를 찾을 수 없습니다.' });
        }

        const name = user.username;
        connectedUsers[name] = true;

        socket.emit('init', { name });

        socket.on('getUsers', () => {
            socket.emit('users', getConnectNames());
        });

        socket.on('room:join', (data) => {
            const room = data.room;
            createRoom(room);
            socket.join(room);

            const roomInfo = getRoomInfo(room);
            socket.emit('room:joined', { room, messages: roomInfo.messages });
        });

        socket.broadcast.emit('user:join', { name });

        socket.on('send:message', function (data) {
            const room = data.room;
            const message = { user: name, text: data.text, time: Date.now() };
            addMessageToRoom(room, message);
            socket.to(room).emit('send:message', message);
        });

        socket.on('change:name', function (data, fn) {
            const newName = data.name;
            if (!connectedUsers[newName]) {
                const oldName = name;
                delete connectedUsers[oldName];
                connectedUsers[newName] = true;
                socket.broadcast.emit('change:name', {
                    oldName,
                    newName
                });
                fn(true);
            } else {
                fn(false);
            }
        });

        socket.on('disconnect', function () {
            delete connectedUsers[name];
            socket.broadcast.emit('user:left', { name });
        });
    });
};

module.exports = handleSocket;
module.exports.connectedUsers = connectedUsers;
