import React, { useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChatPage } from './chat/chat_page.jsx';
import { LoginPage } from './login/login_page.jsx';
import 'regenerator-runtime/runtime'


function App() {
	const [user, setUser] = useState(null);
	const [loginPageError, setLoginPageError] = useState('');

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
			} else {
				setLoginPageError(data.error);
			}
		} catch (err) {
			alert('서버 오류가 발생했습니다.');
			setLoginPageError('서버 오류가 발생했습니다.');
		}
	};

	const handleLogoutSubmit = () => {
		setUser(null);
	}

	return (
		<div className='app-container'>
			{!user ? (
				<LoginPage
					onLoginSubmit={handleLoginSubmit}
					error={loginPageError}
				/>
			) : (
				<ChatPage
					initUser={user}
					onLogoutSubmit={handleLogoutSubmit}
				/>
			)}
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);