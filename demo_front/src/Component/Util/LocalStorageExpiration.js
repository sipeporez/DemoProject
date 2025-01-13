// 로컬스토리지에 만료시간 설정하여 저장/검증 하는 함수
// type = SET -> 저장 | key = 키 이름 | value = 저장할 값 | min = 만료시간 (분)
// type = GET -> 검증 | key = 키 이름 
const LocalStorageExpiration = ( type, key, value, min ) => {
    let data;

    switch (type.toUpperCase()) {
        case "SET":
            const time = Date.now() + min * 60 * 1000; // 만료 시간 계산
            data = {
                value: value,
                expirationTime: time
            };
            localStorage.setItem(key, JSON.stringify(data));
            break;
        case "GET":
            data = JSON.parse(localStorage.getItem(key));

            if (!data) return null;

            const currentTime = Date.now();
            if (currentTime > data.expirationTime) {
                localStorage.removeItem(key); // 만료된 데이터는 삭제
                return null;
            }
            return data.value; // 유효한 데이터 반환
        default:
            return null;
    }
}

export default LocalStorageExpiration;
