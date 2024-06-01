import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChatPage } from './chat/chat_page.jsx';
import { LoginPage } from './login/login_page.jsx';
import { UserPage } from './user/user_page.jsx';
import io from 'socket.io-client';
import 'regenerator-runtime/runtime';

function App() {
	const [user, setUser] = useState(null);
	const [currentPage, setCurrentPage] = useState('login');
	const [loginPageError, setLoginPageError] = useState('');
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (user) {
			const newSocket = io({
				autoConnect: false
			});
			newSocket.connect();
			newSocket.emit('login', { username: user });
			setSocket(newSocket);

			return () => {
				newSocket.disconnect();
				setSocket(null);
			};
		}
	}, [user]);

	const handleLoginSubmit = async (username, password) => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});
			const data = await response.json();
			if (response.ok) {
				setLoginPageError('');
				setUser(username);
				setCurrentPage('chat');
			} else {
				setLoginPageError(data.error);
			}
		} catch (err) {
			alert('서버 오류가 발생했습니다.');
			setLoginPageError('서버 오류가 발생했습니다.');
		}
	};

	const handleLogoutSubmit = () => {
		if (socket) {
			socket.disconnect();
			setSocket(null);
		}
		setUser(null);
		setCurrentPage('login');
	};

	const navigateTo = (page) => {
		setCurrentPage(page);
	};

	return (
		<div className='app-container'>
			{user && (
				<nav className="nav-bar">
					<ul>
						<li className={currentPage === 'chat' ? 'active' : ''}>
							<button onClick={() => navigateTo('chat')}>Chat</button>
						</li>
						<li className={currentPage === 'user' ? 'active' : ''}>
							<button onClick={() => navigateTo('user')}>User</button>
						</li>
						<li>
							<button onClick={handleLogoutSubmit}>Logout</button>
						</li>
					</ul>
				</nav>
			)}
			<div>
				{currentPage === 'login' && (
					<LoginPage onLoginSubmit={handleLoginSubmit} error={loginPageError} />
				)}
				{currentPage === 'chat' && user && socket && (
					<ChatPage initUser={user} socket={socket} />
				)}
				{currentPage === 'user' && user && socket && (
					<UserPage initUser={user} socket={socket} />
				)}
				{currentPage !== 'login' && (!socket || !user) && (
					<div>Loading...</div>
				)}
			</div>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
