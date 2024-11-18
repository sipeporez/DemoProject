import { CustomAxios } from "../CustomAxios"

// 이메일 인증 확인용 컴포넌트
const CheckEnabled = async () => {
    try {
        await CustomAxios({
            methodType: "GET",
            backendURL: "checkauth",
        })
    } catch (error) {
        if (error.response.status === 401) {
            alert(error.response.data)
            window.location.href = "/verify"
            return false;
        }
        
    }

}

export default CheckEnabled
