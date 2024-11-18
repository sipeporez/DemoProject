import React from 'react'

// 회원가입 Input 컴포넌트 분리
const RegisterInput = ({id, type="text", placeholder, min, max, onChange, onBlur}) => {
    return (
        <div className="form-floating my-2">
            <input type={type} className="form-control" id={id} placeholder={placeholder}
                onChange={onChange}
                minLength={min}
                maxLength={max}
                onBlur={onBlur} />
            <label htmlFor={id}>{placeholder}</label>
        </div>
    )
}

export default RegisterInput
