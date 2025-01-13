import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import RegisterInput from '../Form/RegisterInput';
import { CustomAxios } from '../CustomAxios';
import { LoginState } from '../../Recoil/LoginStateAtom';
import { useRecoilState } from 'recoil';
import Spinner from '../UI/Spinner';
import CheckAdmin from '../Util/CheckAdmin';

const CheckOAuth = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [username, setUserName] = useState('');
    const [nickname, setNickname] = useState('');
    // 이름 검증 (div 렌더링용)
    // null = 초기값 | false = 길이검사 fail | true = 사용가능
    const [checkUserName, setCheckUserName] = useState(null);
    // 닉네임 검증 (div 렌더링용)
    // null = 초기값 | x = 길이검사 fail | false = 중복닉네임 | true = 사용가능
    const [checkNickname, setCheckNickname] = useState(null);
    const [loginState, setLoginState] = useRecoilState(LoginState);

    useEffect(() => {
        sessionStorage.removeItem("token");
        // URLSearchParams를 사용하여 쿼리 파라미터 추출
        const parseURL = new URLSearchParams(location.search);
        const flag = parseURL.get("needChange");
        const token = parseURL.get("key");
        const user = parseURL.get("name");

        const url = new URL(window.location.href); // 현재 URL을 가져옴
        url.search = ''; // 쿼리 파라미터를 빈 문자열로 설정하여 제거 
        window.history.replaceState({}, '', url.toString()); // 새 URL로 변경

        if (token !== null) {
            sessionStorage.setItem("token", token);
        }

        if (flag !== 'y') {
            setLoading(true);
            CheckAdmin();
            sessionStorage.setItem("user", user);
            setTimeout(() => {
                setLoginState(true);
                window.location.href = "/home";
            }, 100);
        } else {
            setLoading(false);
        }
    }, []);

    // 입력값 길이 검사
    const handleLengthCheck = (data, minLen, maxLen) => {
        let dd = data.trim()
        if (dd.length < minLen || dd.length > maxLen || dd === '') return false;
        return true;
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

        if (checkUserName === true && checkNickname === true) {
            const userdata = {
                "name": username,
                "nickname": nickname
            }
            try {
                await CustomAxios({
                    methodType: "POST",
                    backendURL: "oauthjoin",
                    fetchData: userdata,
                    onResponse: (resp) => {
                        setLoading(false)
                        alert("정보 수정이 완료되었습니다.")
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

    return (
        <div className='flex justify-center items-center w-full bg-body-tertiary font-Pretendard'>
            <div className="flex align-items-center py-4 ml-0 lg:ml-32 xl:ml-48 min-h-[calc(100vh-64px)] min-w-[300px]">
                {loading ? <div className="w-full flex justify-center"><Spinner width={8} height={8} border={4} /></div> :
                    <main className="form-signin w-100 m-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="h3 mb-3">OAuth2.0 Login</div>
                            <h6>사이트에서 사용하실 이름과 닉네임을 설정 해주세요.</h6>
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
                            <button className="btn btn-success w-100 py-2 mt-2" type="submit"
                                disabled={!(checkUserName === true && checkNickname === true)}
                            >정보수정</button>
                        </form>
                        <p className="mt-5 mb-3 text-body-secondary">&copy; 2024 Seong</p>
                    </main>
                }
            </div>
        </div>
    )
}


export default CheckOAuth
