var express = require('express');
var router = express.Router();

var { getRoomInfo, getAllRooms } = require('../modules/rooms');

router.get('/rooms', function (req, res) {
    const rooms = getAllRooms();
    res.status(200).json({ rooms });
});

router.get('/:roomName', function (req, res) {
    const roomName = req.params.roomName;
    const roomInfo = getRoomInfo(roomName);

    if (!roomInfo) {
        return res.status(404).json({ error: '방을 찾을 수 없습니다.' });
    }

    res.status(200).json({ room: roomInfo });
});

module.exports = router;