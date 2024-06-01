import React, { useState } from 'react';

export function MessageForm({ onMessageSubmit, user }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = { user, text };
        onMessageSubmit(message);
        setText(''); // 메시지 전송 후 입력 필드 초기화
    };

    const changeHandler = (e) => {
        setText(e.target.value); // 입력 값에 따라 text 상태 업데이트
    };

    return (
        <div className='message_form'>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='메시지 입력'
                    className='textinput'
                    onChange={changeHandler}
                    value={text}
                />
            </form>
        </div>
    );
}