import axios from 'axios';

export const CustomAxios = async ({ methodType, backendURL, fetchData, onResponse, headers, retryCount = 2, retryDelay = 2000 }) => {
    const URL = process.env.REACT_APP_SPRING_SERVER + backendURL;
    const timeout = 5000;
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('token')
    };

    const makeRequest = async (retryAttempts) => {
        try {
            let response;
            switch (methodType.toUpperCase()) {
                case "GET":
                    response = await axios.get(URL, { headers, timeout });
                    break;
                case "POST":
                    response = await axios.post(URL, fetchData, { headers, timeout });
                    break;
                case "PUT":
                    response = await axios.put(URL, fetchData, { headers, timeout });
                    break;
                case "DELETE":
                    response = await axios.delete(URL, { headers, timeout });
                    break;
                default:
                    throw new Error("method type error");
            }

            if (onResponse) {
                onResponse(response.data, response.headers);
            }
            return response.data;
        } catch (error) {
            if (error.code === 'ECONNABORTED' ) {
                if (retryAttempts > 0) {
                    alert(`서버가 응답하지 않습니다. 연결 재시도 중... (${retryAttempts}번 남음)`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay)); // 재시도 전에 잠시 대기
                    return makeRequest(retryAttempts - 1); // 재시도
                } else {
                    alert("서버가 응답하지 않습니다. 재시도 횟수를 초과했습니다.");
                }
            }
            throw error; // 다른 오류는 그냥 던짐
        }
    };

    return makeRequest(retryCount);
};
