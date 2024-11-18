import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { CustomAxios } from './CustomAxios';
import RegisterInput from './Form/RegisterInput';
import CloudFlareTurnstile from './Util/CloudFlareTurnstile';
import Spinner from './UI/Spinner';

export default function Register() {
    const [userid, setUserID] = useState('');
    const [userpw, setUserPW] = useState('');
    const [userpwCheck, setUserPWCheck] = useState('');
    const [username, setUserName] = useState('');
    const [nickname, setNickname] = useState('');

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    // ID 검증 (div 렌더링용)
    // null = 초기값 | x = 길이검사 fail | 2 = 정규식검사 fail | false = 중복ID | true = 사용가능
    const [checkID, setCheckID] = useState(null);

    // 패스워드 검증 (div 렌더링용)
    // null = 초기값 | x = 길이검사 fail | false = 일치안함 | true = 일치
    const [checkPW, setCheckPW] = useState(null);

    // 이름 검증 (div 렌더링용)
    // null = 초기값 | false = 길이검사 fail | true = 사용가능
    const [checkUserName, setCheckUserName] = useState(null);

    // 닉네임 검증 (div 렌더링용)
    // null = 초기값 | x = 길이검사 fail | false = 중복닉네임 | true = 사용가능
    const [checkNickname, setCheckNickname] = useState(null);

    // 입력값 길이 검사
    const handleLengthCheck = (data, minLen, maxLen) => {
        let dd = data.trim()
        if (dd.length < minLen || dd.length > maxLen || dd === '') return false;
        return true;
    }

    // ID 정규식 검사
    const handleRegexCheck = (data) => {
        let dd = data.trim()
        const regex = /^[A-Za-z][A-Za-z0-9_-]*$/;
        return regex.test(dd);
    }

    // Blur 이벤트 - 패스워드 검증
    const handleCheckPassword = () => {
        if (handleLengthCheck(userpw, 6, 64) && handleLengthCheck(userpwCheck, 6, 64)) {
            if (userpw !== userpwCheck) {
                setCheckPW(false);
            }
            else setCheckPW(true);
        } else setCheckPW('x');
    }

    // Blur 이벤트 - 아이디 검증
    const handleCheckID = async () => {
        // 길이검사 - 실패시 x
        if (handleLengthCheck(userid, 4, 16)) {
            // 정규식 검사 - 실패시 2
            if (handleRegexCheck(userid)) {
                try {
                    await CustomAxios({
                        methodType: "POST",
                        backendURL: "checkid",
                        fetchData: { "userid": userid },
                        onResponse: () => {
                            setCheckID(true);
                        }
                    })
                } catch (error) {
                    if (error.status === 409) {
                        setCheckID(false);
                    }
                }
            } else {
                setCheckID(2)
            };
        } else {
            setCheckID('x')
        };
    }

    // Blur 이벤트 - 이름 검증
    const handleCheckName = () => {
        if (handleLengthCheck(username, 1, 16)) {
            setCheckUserName(true);
        }
        else setCheckUserName(false);
    }

    // Blur 이벤트 - 닉네임 검증
    const handleCheckNickname = async () => {
        // 길이검사 - 실패시 x
        if (handleLengthCheck(nickname, 2, 16)) {
            try {
                await CustomAxios({
                    methodType: "POST",
                    backendURL: "checknick",
                    fetchData: { "nickname": nickname },
                    onResponse: () => {
                        setCheckNickname(true);
                    }
                })
            } catch (error) {
                if (error.status === 409) {
                    setCheckNickname(false);
                }
            }
        } else {
            setCheckNickname('x');
        }
    }

    // 가입 submit 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (checkID === true && checkPW === true && checkUserName === true && checkNickname === true) {
            const userdata = {
                "userid": userid,
                "userpw": userpw,
                "name": username,
                "nickname": nickname
            }
            if (!token) {
                alert('Turnstile 인증을 완료해주세요.');
                return;
            }

            // 서버에 turnstile 인증 토큰을 보내는 로직
            try {
                await CustomAxios({
                    methodType: "POST",
                    backendURL: "turnstile",
                    fetchData: JSON.stringify({ token }),
                    onResponse: async (resp) => {
                        // turnstile 인증 성공시 회원가입 POST 요청 전송
                        if (resp) {
                            try {
                                await CustomAxios({
                                    methodType: "POST",
                                    backendURL: "join",
                                    fetchData: userdata,
                                    onResponse: (resp) => {
                                        alert("회원가입이 완료되었습니다.")
                                        window.location.href = "/login"
                                    }
                                })
                            } catch (error) {
                                if (error.status === 400) {
                                    setLoading(false)
                                    alert(error.response.data)
                                }
                                else {
                                    setLoading(false)
                                    alert("서버가 응답하지 않습니다.")
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                setLoading(false)
                alert(error.response.data);
                return;
            }
        }
    }

    return (
        <div className='flex justify-center items-center w-full bg-body-tertiary '>
            <div className="flex align-items-center py-4 w-3/4 md:w-1/3 lg:w-1/4 xl:w-1/5 ml-0 lg:ml-32 xl:ml-48 min-h-[calc(100vh-64px)]">
                {loading ? <Spinner width={8} height={8} border={4} /> : <main className="form-signin w-100 m-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="h3 mb-3">REGISTER</div>
                        <RegisterInput id={"userid"} placeholder={"아이디"} onChange={(e) => setUserID(e.target.value)} min={4} max={16} onBlur={handleCheckID} />
                        <div className='w-full text-sm md:text-md ml-2 my-2 font-bold'>
                            {checkID === null ? <div className='py-2.5' /> :
                                checkID === 'x' ? <div className='text-red-600'>ID의 길이는 4~16자여야 합니다.</div>
                                    : checkID === 2 ? <div className='text-red-600'>ID는 영어로 시작하고<br />대/소문자, 숫자, -, _ 만 사용 가능합니다.</div>
                                        : checkID === true ? <div className='text-green-600'>사용 가능한 ID 입니다.</div>
                                            : <div className='text-red-600'>이미 등록된 ID 입니다.</div>}
                        </div>
                        <RegisterInput id={"userpw"}
                            placeholder={"비밀번호"}
                            type="password" onChange={(e) => setUserPW(e.target.value)} min={6} max={32} onBlur={handleCheckPassword} />
                        <RegisterInput id={"pwCheck"}
                            placeholder={"비밀번호 확인"}
                            type="password" onChange={(e) => setUserPWCheck(e.target.value)} min={6} max={32} onBlur={handleCheckPassword} />
                        <div className='w-full text-sm md:text-md ml-2 my-2 font-bold'>
                            {checkPW === null ? <div className='py-2.5' /> :
                                checkPW === 'x' ? <div className='text-red-600'>패스워드의 길이는 6~32자여야 합니다.</div>
                                    : checkPW === true ? <div className='text-green-600'>패스워드가 일치합니다.</div>
                                        : <div className='text-red-600'>패스워드가 일치하지 않습니다.</div>}
                        </div>
                        <RegisterInput id={"name"}
                            placeholder={"이름"} onChange={(e) => setUserName(e.target.value)} min={1} max={16} onBlur={handleCheckName} />
                        <RegisterInput id={"nickname"}
                            placeholder={"닉네임"} onChange={(e) => setNickname(e.target.value)} min={2} max={16} onBlur={handleCheckNickname} />
                        <div className='w-full text-sm md:text-md ml-2 my-2 font-bold'>
                            {checkNickname === null ? <div className='py-2.5' /> :
                                checkNickname === 'x' ? <div className='text-red-600'>닉네임의 길이는 2~16자여야 합니다.</div>
                                    : checkNickname === true ? <div className='text-green-600'>사용 가능한 닉네임 입니다.</div>
                                        : <div className='text-red-600'>중복된 닉네임 입니다.</div>}
                        </div>
                        <div className='flex justify-center items-center'>
                            <CloudFlareTurnstile setToken={setToken} />
                        </div>
                        <button className="btn btn-success w-100 py-2 mt-2" type="submit"
                            disabled={!(checkID === true && checkPW === true && checkUserName === true && checkNickname === true)}
                        >회원가입</button>
                    </form>
                    <p className="mt-5 mb-3 text-body-secondary">&copy; 2024 Seong</p>
                </main>
                }
            </div>
        </div>
    )
}