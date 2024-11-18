import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { LoginState } from '../../Recoil/LoginStateAtom';

const useLoginCheck = () => {
    // 로그인 상태
    const loginCheck = useRecoilValue(LoginState);

    // 로그인 검사
    useEffect(() => {
        if (!loginCheck) {
            alert("로그인 후 이용 가능합니다.")
            window.location.href = "/login";
            return;
        }
    }, [loginCheck])
    
}

export default useLoginCheck
