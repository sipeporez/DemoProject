import React from 'react';

const GoogleLogin = () => {
    const url = process.env.REACT_APP_SPRING_SERVER_NIP + process.env.REACT_APP_OAUTH2_URL + "google";

    const handleLogin = async () => {
        // window.open(url,"Google Login","popup=yes")
        window.location.href = url;
    }

    return (
        <button
            onClick={handleLogin}
            className='hover:brightness-90 transition-color duration-200'>
            <img alt='구글 로그인' src="/images/login/googleIcon.png" className='w-[41.6px]'/>
        </button>
    )
}

export default GoogleLogin
