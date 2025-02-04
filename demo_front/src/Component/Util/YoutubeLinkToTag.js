const YoutubeLinkToTag = (e) => {
    // youtube 링크 정규식 
    // html 태그를 포함하여 한줄로 표현되기 때문에 다음 <p> 태그까지 탐색
    const regex = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)(?:\/(?:[\w\-]+\?v=|embed\/|shorts\/|v\/)?)([\w\-]+)(.*?)(?=<\/p>)/g;
    // 본문 내용 중 일치하는 모든 youtube 링크 매칭
    const matches = [...e.matchAll(regex)];
    let changedLink = e;
    // 중복된 비디오 ID 처리 방지
    const seenVideos = new Set();
    matches.forEach(match => {
        const videoID = match[1]; // 비디오 ID는 1번째에 저장됨
        // 이미 변환된 링크는 스킵
        if (seenVideos.has(videoID) || changedLink.includes(`src="https://www.youtube.com/embed/${videoID}"`)) {
            return;
        }
        seenVideos.add(videoID); // 비디오 ID 추가
        let tag = `<iframe width="100%" height="480" src="https://www.youtube.com/embed/${videoID}" allowfullscreen="true" referrerpolicy="origin"></iframe></br>`;
        // 매칭된 URL을 iframe으로 교체
        changedLink = changedLink.replace(match[0], tag);
    });
    return changedLink;
}

export default YoutubeLinkToTag;