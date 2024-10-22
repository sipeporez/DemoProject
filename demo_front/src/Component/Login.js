import React from 'react';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Login() {
    const url = process.env.REACT_APP_SPRING_SERVER + "login"

    const [userid, setUserid] = useState('');
    const [userpw, setUserpw] = useState('');
    const [remeberid, setRememberID] = useState(false);
    const navigate = useNavigate();

    const userdata = {
        "userid": userid,
        "userpw": userpw
    }

    useEffect(() =>{
        setUserid(localStorage.getItem("userid"));
    },[])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (remeberid) {
            localStorage.setItem("userid",userid)
        }

        axios.post(url, userdata)
            .then(response => {
                if (response.status === 200) {
                    sessionStorage.setItem("token", response.headers.getAuthorization())
                    navigate("/home")
                }

            })
            .catch(error => {
                if (error.response.status === 401) {
                    alert("등록되지 않은 ID거나 잘못된 Password 입니다.")
                    setUserpw("");
                }
                else {
                    alert("로그인에 실패했습니다.")
                }
            })
    }

    return (
        <div className='flex justify-center items-center w-full bg-body-tertiary'>
            <div className="d-flex align-items-center py-4 " style={{ minHeight: '100vh' }}>
                <main className="form-signin w-100 m-auto">
                    <form onSubmit={handleSubmit}>
                        <h1 className="h3 mb-3 fw-normal">LOGIN</h1>

                        <div className="form-floating my-2">
                            <input type="text" className="form-control" id="userid" placeholder="User ID"
                                value={userid || ''}
                                onChange={(e) => setUserid(e.target.value)} />
                            <label htmlFor="userid">ID</label>
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control" id="userpw" placeholder="Password"
                                value={userpw || ''}
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
                        <button className="btn btn-primary w-100 py-2 mt-2" type="submit">로그인</button>
                    </form>
                    <button className="btn btn-success w-100 py-2 mt-2" type="button" onClick={() => { }}>회원가입</button>
                    <p className="mt-5 mb-3 text-body-secondary">&copy; 2024 Seong</p>
                </main>
            </div>
        </div>
    )
}
