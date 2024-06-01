var express = require('express');
var router = express.Router();

var { addUser, getUser } = require('../modules/users');
var connectedUsers = require('../modules/socket').connectedUsers; // connectedUsers 가져오기

router.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요.' });
    }

    const { error, user } = addUser(username, password);
    if (error) {
        return res.status(400).json({ error });
    }

    res.status(200).json({ message: '회원가입이 완료되었습니다.' });
});

router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요.' });
    }

    // 이미 로그인된 사용자 확인
    if (connectedUsers[username]) {
        return res.status(400).json({ error: '이미 로그인된 사용자입니다.' });
    }

    const user = getUser(username);
    if (!user || user.password !== password) {
        return res.status(400).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });
    }

    res.status(200).json({ message: '로그인 성공', user: user });
});

module.exports = router;