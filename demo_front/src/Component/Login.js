import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { LoginState } from '../Recoil/LoginStateAtom';
import { CustomAxios } from './CustomAxios';
import CheckAdmin from './Util/CheckAdmin';
import CloudFlareTurnstile from './Util/CloudFlareTurnstile';
import Spinner from './UI/Spinner';
import NaverLogin from './Login/NaverLogin';
import GoogleLogin from './Login/GoogleLogin';
import KakaoLogin from './Login/KakaoLogin';

export default function Login() {
    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const [remeberid, setRememberID] = useState(false);
    const [loginState, setLoginState] = useRecoilState(LoginState);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    const userdata = {
        "userid": userid,
        "userpw": userpw
    }
    // 저장된 아이디 불러오기
    useEffect(() => {
        setUserid(localStorage.getItem("userid"));
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (remeberid) {
            localStorage.setItem("userid", userid);
        }

        if (!userid || !userpw) {
            setLoading(false);
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        if (!token) {
            setLoading(false);
            alert('Turnstile 인증에 실패했습니다. 페이지를 새로고침 해주세요');
            return;
        }

        // 서버에 인증 토큰을 보내는 로직
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
                                backendURL: "login",
                                fetchData: userdata,
                                onResponse: async (resp, header) => {
                                    sessionStorage.setItem("token", header.authorization);
                                    sessionStorage.setItem("user", resp);
                                    setLoginState(true);
                                    await CheckAdmin();
                                    window.location.href = "/home";
                                }
                            })
                        } catch (error) {
                            if (error.status === 401) {
                                setLoading(false);
                                alert("등록되지 않은 ID거나 잘못된 비밀번호 입니다.");
                                setUserpw("");
                            }
                            else {
                                setLoading(false);
                                alert("로그인 서버가 응답하지 않습니다.");
                            }
                        }
                    }
                }
            });
        } catch (error) {
            alert(error.response.data);
            return;
        }

    }

    return (
        <div className='flex justify-center items-center w-full bg-body-tertiary font-Pretendard'>
            <div className="flex align-items-center py-4 ml-0 lg:ml-32 xl:ml-48 min-h-[calc(100vh-64px)] min-w-[300px]">
                {loading ? <div className='w-full flex justify-center'><Spinner width={8} height={8} border={4} /></div>
                    : <main className="form-signin w-100 m-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="h3 mb-3">LOGIN</div>
                            <div className="form-floating my-2">
                                <input type="text" className="form-control" id="userid" placeholder="ID"
                                    maxLength={16}
                                    value={userid || ''}
                                    onChange={(e) => setUserid(e.target.value)} />
                                <label htmlFor="userid">ID</label>
                            </div>
                            <div className="form-floating">
                                <input type="password" className="form-control" id="userpw" placeholder="Password"
                                    value={userpw || ''}
                                    maxLength={64}
                                    onChange={(e) => setUserpw(e.target.value)} />
                                <label htmlFor="userpw">Password</label>
                            </div>

                            <div className="form-check text-start my-3">
                                <input className="form-check-input" type="checkbox" id="remember-ID"
                                    onChange={(e) => setRememberID(e.target.checked)} />
                                <label className="form-check-label" htmlFor="remember-ID">
                                    ID 기억하기
                                </label>
                            </div>
                            <CloudFlareTurnstile setToken={setToken} />
                            <button className="btn btn-primary w-100 py-2 mt-2" type="submit">로그인</button>
                        </form>
                        <button className="btn btn-success w-100 py-2 mt-2" type="button" onClick={() => { window.location.href = "/join" }}>회원가입</button>
                        <div className='text-center w-full my-2'>
                            <div className='mt-4 mb-2.5 text-sm'>소셜 로그인</div>
                            <div className='flex justify-around'>
                                <GoogleLogin /> <NaverLogin /> 
                                {/* <KakaoLogin /> */}
                            </div>
                        </div>
                        <p className="mt-4 mb-3 text-body-secondary">&copy; 2024 Seong</p>
                    </main>}
            </div>
        </div>
    )
}
