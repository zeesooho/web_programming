import React, { useState } from 'react';

export function ChangeNameForm({ onChangeName }) {
    const [newName, setNewName] = useState('');

    const handleInputChange = (e) => {
        setNewName(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onChangeName(newName);
        setNewName(''); // 입력 필드 초기화
    };

    return (
        <div className='change_name_form'>
            <h3>아이디 변경</h3>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='변경할 아이디 입력'
                    onChange={handleInputChange}
                    value={newName}
                />
                <button type="submit">변경</button> {/* 제출 버튼 추가 */}
            </form>
        </div>
    );
}