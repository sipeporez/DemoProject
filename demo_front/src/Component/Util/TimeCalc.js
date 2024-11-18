const TimeCalc = ({ time }) => {

    const now = new Date(); // 현재 시간
    const timeDifference = now - new Date(time); // 시간차

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // 차이가 1일 이상이면 ~일 전
    if (days > 0) {
        return `${days}일 전`;
    }
    // 차이가 1시간 이상이면 ~시간 전
    if (hours > 0) {
        return `${hours}시간 전`;
    }
    // 차이가 1분 이상이면 ~분 전
    if (minutes > 0) {
        return `${minutes}분 전`;
    }
    // 그 외는 초 단위로 ~초 전
    return `${seconds}초 전`;
}

export default TimeCalc
