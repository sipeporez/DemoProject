import { CheckIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CustomAxios } from '../CustomAxios'
import CustomButton from '../UI/CustomButton'
import Spinner from '../UI/Spinner'
import CloudFlareTurnstile from './CloudFlareTurnstile'
import LocalStorageExpiration from './LocalStorageExpiration'
import axios from 'axios'

const VerifyEmail = () => {

    // 이메일 링크 클릭시 발행된 토큰
    const [param] = useSearchParams();
    const key = param.get('key');

    // 이메일 입력받기
    let email = null;
    const emailRef = useRef('')
    // 이메일 전송중일때 로딩바
    const [loading, setLoading] = useState(false);
    // 인증 완료된 경우 재랜더링용 상태
    const [verified, setVerified] = useState(false);
    // 턴스타일용 토큰
    const [token, setToken] = useState(null);
    // 이메일 전송 완료 후 턴스타일 재인증 방지
    const [send, setSend] = useState(false);


    // 인증 여부 확인
    const checkVerifiy = async () => {
        try {
            await CustomAxios({
                methodType: "GET",
                backendURL: "checkauth",
                onResponse: () => {
                    alert("이미 인증 되었습니다.");
                    window.location.href = "/home";
                }
            })
        } catch (error) {
            if (error.response.status === 401) {
                return true;
            }
        }
    }

    useEffect(() => {
        checkVerifiy();
        if (key) {
            const url = new URL(window.location.href); // 현재 URL을 가져옴
            url.search = ''; // 쿼리 파라미터를 빈 문자열로 설정하여 제거 
            window.history.replaceState({}, '', url.toString()); // 새 URL로 변경

            handleKey();
            // 2초 후에 /home으로 리디렉션
            const timer = setTimeout(() => {
                window.location.href = "/home";
            }, 2000);
            // 컴포넌트 언마운트 시 타이머를 정리
            return () => clearTimeout(timer);
        }
    }, [key])

    // 이메일 링크 클릭시 인증 키 검증
    const handleKey = async () => {
        setLoading(true);
        if (key.trim() !== '') {
            try {
                // 이메일로 받은 토큰
                const data = { "token": key };
                // 로컬 스토리지에 저장한 임시 로그인 상태 토큰 -> 헤더에 추가
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': LocalStorageExpiration("GET", "token")
                };
                let resp = await axios.post(process.env.REACT_APP_SPRING_SERVER + "verifykey", data, { headers });
                if (resp) {
                    localStorage.removeItem("token");
                    setLoading(false);
                    setVerified(true);
                }
            } catch (error) {
                setLoading(false);
                console.log(error)
                if (error.response.data === "이메일 인증 후 사용 가능합니다.") {
                    alert("이메일 인증에 실패하였습니다. 다시 시도 해주세요.")
                }
                else alert(error.response.data);
            }
        }
    }

    const handleRegexCheck = (data) => {
        let dd = data.trim();
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
        return regex.test(dd);
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (handleRegexCheck(emailRef.current.value)) {
            email = emailRef.current.value;
        } else {
            setLoading(false);
            alert("올바른 이메일을 입력해주세요.");
            return;
        }
        if (!token) {
            setLoading(false);
            alert('Turnstile 인증을 완료해주세요.');
            return;
        }

        try {
            await CustomAxios({
                methodType: "POST",
                backendURL: "turnstile",
                fetchData: JSON.stringify({ token }),
                onResponse: async (resp) => {
                    if (resp) {
                        try {
                            await CustomAxios({
                                methodType: "POST",
                                backendURL: "verifyemail",
                                fetchData: { "email": email },
                                onResponse: (resp) => {
                                    // 이메일 전송 성공시 localstorage에 5분짜리 토큰 저장
                                    LocalStorageExpiration("SET", "token", sessionStorage.getItem("token"), 5);
                                    setLoading(false)
                                    setSend(true)
                                    alert("인증용 이메일을 전송했습니다. 5분 이내에 이메일을 확인 해주세요.")
                                    window.location.href = "/home";
                                }
                            })
                        } catch (error) {
                            setLoading(false);
                            alert(error.response.data);
                        }
                    }
                    else {
                        setLoading(false)
                        alert("Turnstile 인증에 실패했습니다. 새로고침 후 다시 시도 해주세요.");
                    }
                }
            })
        }
        catch (error) {
            setLoading(false)
            alert(error.response.data);
        }
    }

    return (
        <div className='flex justify-center items-center min-h-[calc(100vh-64px)]'>
            <div className='bg-body-tertiary rounded-md ml-0 lg:ml-32 xl:ml-48 w-3/4 md:w-1/2 max-w-screen-xl shadow-lg'>
                <div className="h3 mt-4 ml-4">이메일 인증</div>
                {loading ?
                    <div className="flex justify-center items-center h-60 my-1.5">
                        <Spinner width={8} height={8} border={4} />
                    </div> :
                    verified ? <div className="flex flex-col justify-center items-center h-60 my-1.5">
                        <CheckIcon width={150} height={150} />
                        <span className='font-bold text-green-600'>이메일 인증이 완료되었습니다!</span>
                    </div> :
                        <form onSubmit={handleVerify} className='w-full'>
                            <div className="form-floating m-12 flex flex-col gap-4 justify-center">
                                <input type="email" className="form-control" id="email" placeholder="E-Mail"
                                    minLength={4}
                                    maxLength={64}
                                    ref={emailRef} />
                                <label htmlFor="email">E-Mail</label>
                                <CustomButton label={"이메일 인증"} onClick={handleVerify} />
                                {send ? <></> : <div className='flex justify-center'>
                                    <CloudFlareTurnstile setToken={setToken} />
                                </div>}
                            </div>
                        </form>
                }
            </div>
        </div>
    )
}

export default VerifyEmail