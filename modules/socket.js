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

// export function for listening to the socket
module.exports = function (socket) {
  socket.on('login', (data) => {
    const user = getUser(data.username);
    if (!user) {
      return socket.emit('error', { message: '사용자를 찾을 수 없습니다.' });
    }

    const name = user.username;

    connectedUsers[name] = true;

    // send the new user their name and a list of users
    socket.emit('init', {
      name: name,
      users: getConnectNames()
    });

    socket.on('room:join', (data) => {
      const room = data.room;
      const name = data.username;
      
      createRoom(room);
      socket.join(room);
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
      name: name
    });

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
      socket.broadcast.emit('send:message', {
        user: name,
        text: data.text
      });
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, fn) {
      const newName = data.name;

      if (!connectedUsers[newName]) {
        const oldName = name;

        delete connectedUsers[oldName];
        connectedUsers[newName] = true;

        socket.broadcast.emit('change:name', {
          oldName: oldName,
          newName: newName
        });

        fn(true);
      } else {
        fn(false);
      }
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
      console.log(`User ${name} disconnected`); 

      delete connectedUsers[name];

      socket.broadcast.emit('user:left', {
        name: name
      });
    });
  });
};
