import React, { useEffect, useRef, useState } from 'react';

const CloudFlareTurnstile = ({setToken}) => {
    const siteKey = process.env.REACT_APP_SITE_KEY;
    
    const turnstileRef = useRef(null);

    useEffect(() => {
        // Turnstile 위젯을 수동으로 초기화
        if (turnstileRef.current && window.turnstile) {
            window.turnstile.render(turnstileRef.current, {
                sitekey: siteKey, // Cloudflare에서 발급받은 사이트 키
                callback: (token) => {
                    setToken(token); 
                }
            });
        }
    }, []);

    return <div ref={turnstileRef}></div>;
};

export default CloudFlareTurnstile;