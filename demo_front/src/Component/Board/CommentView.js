import React, { useEffect, useState, Fragment } from 'react';
import { CustomAxios } from '../CustomAxios';
import CustomButton from '../UI/CustomButton';
import CommentWrite from '../Form/CommentWrite';


const CommentView = ({ boardIdx, commentState }) => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState({ number: 0, size: 10, totalElements: 0 });

    useEffect(() => {
        fetchComments(page.number, page.size);
    }, [page.number, page.size, boardIdx, commentState]);

    const fetchComments = async (currentPage, pageSize) => {
        try {
            await CustomAxios({
                methodType: 'get',
                backendURL: `board/view/${boardIdx}/comment?page=${currentPage}&size=${pageSize}`,
                onResponse: handleResponse,
            });
        }
        catch (error) {
            alert(error.response.data);
        }
    };

    const handleResponse = (response) => {
        console.log(response, boardIdx)
        setComments(response.content);
        setPage({
            number: response.page.number,
            size: response.page.size,
            totalElements: response.page.totalElements,
        });
    };

    const handlePageChange = (newPage) => {
        setPage((prev) => ({ ...prev, number: newPage }));
    };

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

    const handleCommentEdit = () => {
        return (
            <>
                <CommentWrite></CommentWrite>
            </>
        )
    }

    const totalPages = Math.ceil(page.totalElements / page.size);

    return (
        <div className='flex justify-center items-center'>
            {comments &&
                <div className="flex flex-col bg-gray-300 rounded-lg w-full h-full max-w-screen-xl">
                    {comments.map((comment) => (
                        <div key={comment.idx} className="my-2">
                            <div className="text-start text-sm font-bold">{comment.nickname}</div>
                            <div className='flex'>
                                <div className="text-start ml-2 w-9/12 break-words">{lineBreak(comment.content)}</div>
                                <div className='flex justify-evenly items-center w-3/12 text-xs'>
                                    <div><CustomButton label={'답글'} px={2} py={1} mb={1} /></div>
                                    <div><CustomButton label={'수정'} px={2} py={1} mb={1} /></div>
                                    <div><CustomButton label={'삭제'} px={2} py={1} mb={1} /></div>
                                </div>
                            </div>
                            <div className="text-gray-500 text-xs text-right mr-2 ">{new Date(comment.writtenDate).toLocaleString()}</div>
                        </div>
                    ))}

                    {/* 페이지네이션 */}
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => handlePageChange(page.number - 1)}
                            disabled={page.number === 0}
                            className={`px-3 py-1 bg-blue-500 text-white rounded ${page.number === 0 && 'opacity-50 cursor-not-allowed'}`}
                        >
                            이전 댓글
                        </button>
                        <span>{`${page.number + 1} / ${totalPages}`}</span>
                        <button
                            onClick={() => handlePageChange(page.number + 1)}
                            disabled={page.number >= totalPages - 1}
                            className={`px-3 py-1 bg-blue-500 text-white rounded ${page.number >= totalPages - 1 && 'opacity-50 cursor-not-allowed'}`}
                        >
                            다음 댓글
                        </button>
                    </div>
                </div>
            }
        </div>
    );
};

export default CommentView;
