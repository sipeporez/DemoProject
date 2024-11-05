import React, { useEffect, useState } from 'react'
import { CustomAxios } from '../CustomAxios'
import CommentView from './CommentView'
import LikeButton from './LikeButton'
import CommentWrite from '../Form/CommentWrite'
import { Fragment } from 'react'

const BoardView = ({ boardIdx }) => {

    const [data, setData] = useState('');
    const [commentState, setcommentState] = useState(0);

    useEffect(() => {
        fetchData(boardIdx);
    }, [boardIdx])

    const fetchData = async (idx) => {
        try {
            await CustomAxios({
                methodType: 'get',
                backendURL: `board/view/${idx}`,
                onResponse: handleResponse,
            });
        } catch (error) {
            alert(error.response.data);
        }
    }

    const handleResponse = (response) => {
        setData(response);
    };

    // 댓글 수정/삭제 시 재렌더링용 카운트 -> CommentView에 전달하여 재렌더링
    const handleCommentState = () => {
        setcommentState((prevCount) => prevCount + 1);
    }

    // 개행문자를 <br> 태그로 바꿔주는 함수
    // 마지막 줄이 아닌 경우 <br> 태그 추가
    const lineBreak = (content) => {
        return content.split('\n').map((line, index) => (
            <Fragment key={index}>
                {line}
                {index < content.split('\n').length - 1 && <br />}
            </Fragment>
        ));
    };

    return (
        <div className='flex justify-center items-center min-h-screen'>
            {data &&
                <div className="flex flex-col bg-gray-300 rounded-lg w-1/2 h-full max-w-screen-xl">
                    <div className="mt-3 mx-3 min-w-screen font-bold text-2xl break-words">
                        {data.title}
                    </div>
                    <div className="text-right mx-3">
                        {data.nickname}
                    </div>
                    <h6 className="text-gray-500 text-right mx-3 text-sm">
                        {new Date(data.writtenDate).toLocaleString()}
                    </h6>
                    <div className="min-w-screen mx-3 border-t-2 my-2 border-gray-500" />
                    <div className="text-lg text-start mx-3 mb-3 break-words">
                        {lineBreak(data.content)}
                    </div>
                    <div className="flex justify-end items-end mx-3 mb-3">
                        <LikeButton boardIdx={data.idx} likeCnt={data.likeCnt}></LikeButton>
                    </div>
                    {/* <div className="min-w-screen mx-3 border-t-2 mb-2 border-gray-500" /> */}
                    <div className='mx-3 min-w-screen'>
                        <CommentView
                            boardIdx={boardIdx}
                            commentState={commentState} />
                        <CommentWrite
                            boardIdx={boardIdx}
                            commentState={commentState}
                            onCommentWritten={handleCommentState} />
                    </div>

                </div>
            }
        </div>
    )
}

export default BoardView
