import { CustomAxios } from '../CustomAxios'

// 어드민, 매니저 확인용
// 유저인 경우 null
const CheckAdmin = async () => {
    try {
        await CustomAxios({
            methodType: "GET",
            backendURL: "role",
            onResponse: (resp) => {
                if (resp.data !== null) {
                    sessionStorage.setItem("CheckAdmin", resp)
                }
            }
        })
    } catch (error) {
    }
}

export default CheckAdmin