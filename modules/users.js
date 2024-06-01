let users = [];

const addUser = (username, password) => {
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return { error: '이미 존재하는 아이디입니다.' };
    }

    const newUser = { username, password };
    users.push(newUser);
    return { user: newUser };
};

const getUser = (username) => {
    return users.find(user => user.username === username);
};

module.exports = { addUser, getUser };