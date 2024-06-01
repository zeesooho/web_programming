import React, { useState } from 'react';
import 'regenerator-runtime/runtime';

export function LoginPage({ onLoginSubmit, error }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleLoginClick = () => {
        if (!username || !password) {
            setLocalError('아이디와 비밀번호를 입력하세요.');
        } else {
            setLocalError('');
            onLoginSubmit(username, password);
        }
    };

    const handleSignUpClick = async () => {
        if (!username || !password) {
            setLocalError('아이디와 비밀번호를 입력하세요.');
        } else {
            setLocalError('');
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    setLocalError('');
                    alert(data.message);
                } else {
                    setLocalError(data.error);
                }
            } catch (err) {
                setLocalError(err.message);
            }
        }
    };

    return (
        <div className="login-container">
            <form className="login-form">
                <input
                    type="text"
                    placeholder="아이디"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    required
                />
                <div className="buttons">
                    <button type="button" onClick={handleLoginClick}>로그인</button>
                    <button type="button" onClick={handleSignUpClick}>회원가입</button>
                </div>
                {localError && <div className="error">{localError}</div>}
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
}
