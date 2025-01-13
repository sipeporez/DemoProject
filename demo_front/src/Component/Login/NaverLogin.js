import React from 'react'

const NaverLogin = () => {

    const url = process.env.REACT_APP_SPRING_SERVER + process.env.REACT_APP_OAUTH2_URL + "naver";

    const handleLogin = () => {
        window.location.href = url;
    }

    return (
        <button
            onClick={handleLogin}
            className='hover:brightness-90 transition-color duration-200'>
            <img alt='네이버 로그인' src="/images/login/naverIcon.png" className='w-[41.6px]' />
        </button>
    )
}

export default NaverLogin
