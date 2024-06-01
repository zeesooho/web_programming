let rooms = {};

const createRoom = (roomName) => {
    if (!rooms[roomName]) {
        rooms[roomName] = {
            messages: []
        };
    }
};


const addMessageToRoom = (roomName, message) => {
    if (rooms[roomName]) {
        rooms[roomName].messages.push(message);
    }
};

const getRoomInfo = (roomName) => {
    return rooms[roomName] || null;
};

const getAllRooms = () => {
    return Object.keys(rooms);
};

module.exports = {
    createRoom,
    addMessageToRoom,
    getRoomInfo,
    getAllRooms
};