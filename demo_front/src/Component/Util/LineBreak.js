import {React, Fragment} from 'react'

// 개행문자를 <br> 태그로 바꿔주는 함수
// 마지막 줄이 아닌 경우 <br> 태그 추가
const LineBreak = (content) => {
    return content.split('\n').map((line, index) => (
        <Fragment key={index}>
            {line}
            {index < content.split('\n').length - 1 && <br />}
        </Fragment>
    ));
};

export default LineBreak
