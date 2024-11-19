import { ArrowTurnDownRightIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useEffect, useState } from 'react';
import { CustomAxios } from '../CustomAxios';
import ReplyWrite from '../Form/ReplyWrite';
import ReplyView from './ReplyView';
import { LoginState } from '../../Recoil/LoginStateAtom';
import { useRecoilValue } from 'recoil';
import LineBreak from '../Util/LineBreak';
import CommentEdit from '../Form/CommentEdit';
import Paging from '../UI/Paging';

const CommentView = ({ boardIdx, commentState, onCommentWritten }) => {
    const [comments, setComments] = useState([]);
    const [commentID, setCommentID] = useState('');

    const [replys, setReplys] = useState([]);
    const [replysID, setReplysID] = useState('');

    const [page, setPage] = useState({
        number: 0,
        size: 10,
        totalElements: 0
    });
    const nickname = sessionStorage.getItem("user");
    const CheckAdmin = sessionStorage.getItem("CheckAdmin");
    const loginCheck = useRecoilValue(LoginState);

    useEffect(() => {
        fetchComments(page.number, page.size);
        fetchReplys()
    }, [page.number, page.size, boardIdx, commentState]);

    // 댓글 가져오기
    const fetchComments = async (number, size) => {
        try {
            await CustomAxios({
                methodType: 'get',
                backendURL: `board/view/${boardIdx}/comment?page=${number}&size=${size}`,
                onResponse: (resp) => {
                    setComments(resp.content);
                    setPage({ ...resp.page });
                },
            });
        }
        catch (error) {
            alert(error.response.data);
        }
    };

    // 대댓글 가져오기
    const fetchReplys = async () => {
        try {
            await CustomAxios({
                methodType: 'get',
                backendURL: `board/view/${boardIdx}/reply`,
                onResponse: (resp) => {
                    setReplys(resp.sort((a, b) => a.idx - b.idx))
                },
            });
        }
        catch (error) {
            alert(error.response.data);
        }
    };

    // 댓글 페이지네이션 (페이지 클릭시 fetch 후 스크롤)
    // 백앤드 pageNumber는 0부터 시작하므로 -1
    const handlePageChange = (pageNumber) => {
        fetchComments(pageNumber - 1, page.size);
        handleScroll("comment");
    };

    // 페이지 클릭시 댓글 최상단으로 스크롤
    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const navBarSize = 64;  // Nav바 사이즈(px)
            const position = element.offsetTop - navBarSize;
            window.scrollTo({
                top: position,
                behavior: 'auto'
            });
        }
    }

    // 댓글 수정
    const handleCommentEdit = async (commentId) => {
        if (commentId === commentID) {
            setCommentID(null);     // 댓글창 닫기
        } else {
            setCommentID(commentId);   // 댓글창 열기
        }
        await onCommentWritten();
    }

    // 댓글 삭제
    const handleCommentDelete = async (commentIdx) => {
        let check = window.confirm("댓글을 삭제 하시겠습니까?");
        if (check) {
            try {
                await CustomAxios({
                    methodType: 'DELETE',
                    backendURL: `comment/delete/${commentIdx}`,
                });
            }
            catch (error) {
                alert(error.response.data);
            }
            onCommentWritten();
        }
    }

    // 대댓글 쓰기 => 쓰고 나서 번쩍거림 수정 필요
    const handleReplyWrite = (replyId) => {
        if (replyId === replysID) {
            setReplysID(null); // 답글창 닫기
        } else {
            setReplysID(replyId);   // 답글창 열기
        }
        onCommentWritten(); // 상위 컴포넌트(BoardView) 에서 받은 함수, 댓글 작성 완료시 재랜더링
    }

    // 대댓글 수정
    const handleReplyEdit = (replyIdx) => {
        if (replyIdx === replysID) {
            setReplysID(null); // 답글창 닫기
        } else {
            setReplysID(replyIdx);   // 답글창 열기
        }
        onCommentWritten();
    }

    // 대댓글 삭제
    const handleReplyDelete = async (replyIdx) => {
        let check = window.confirm("댓글을 삭제 하시겠습니까?");
        if (check) {
            try {
                await CustomAxios({
                    methodType: "DELETE",
                    backendURL: `reply/delete/${replyIdx}`
                })
            } catch (error) {
                alert(error.response.data)
            }
            onCommentWritten();
        }
    }

    return (
        <div className='flex justify-center items-center' id="comment">
            {comments &&
                <div className="flex flex-col bg-gray-300 rounded-lg w-full h-full max-w-screen-xl">
                    {comments.map((comment, index) => (
                        <div key={comment.idx} className="my-2">
                            <div className="text-start text-sm font-bold">{comment.nickname}{comment.edited && !comment.deleted ? <span className='text-xs font-thin text-gray-500 ml-2'>(댓글 수정됨)</span> : null}</div>
                            <div className='flex'>
                                <div className="text-start ml-2 w-full break-words">
                                    {commentID === comment.commentId ?
                                        <CommentEdit commentIdx={comment.idx} content={comment.content} onWrite={handleCommentEdit} />
                                        : LineBreak(comment.content)}
                                </div>
                                <div className='flex mr-2 justify-end gap-4 items-center w-3/12 text-xs'>
                                    <div>
                                        {loginCheck ? <label>
                                            <ArrowTurnDownRightIcon
                                                className='w-4 h-4'
                                                onClick={() => handleReplyWrite(comment.commentId, index)} />
                                        </label> : null
                                        }</div>
                                    <div>
                                        {((comment.nickname === nickname && !comment.deleted) ||
                                            (!comment.deleted && CheckAdmin === 'X')) ? <label>
                                            <PencilSquareIcon
                                                className='w-4 h-4'
                                                onClick={() => handleCommentEdit(comment.commentId)} />
                                        </label> : <div className='px-2' />
                                        }</div>
                                    <div>
                                        {((comment.nickname === nickname && !comment.deleted) ||
                                            (!comment.deleted && CheckAdmin === 'X')) ? <label>
                                            <TrashIcon className='w-4 h-4'
                                                onClick={() => handleCommentDelete(comment.idx)} />
                                        </label> : <div className='px-2' />
                                        }</div>
                                </div>
                            </div>
                            <div className="text-gray-500 text-xs text-right mr-2 ">
                                {new Date(comment.writtenDate).toLocaleString()}
                            </div>
                            <div>
                                {replysID === comment.commentId &&
                                    <ReplyWrite
                                        boardIdx={boardIdx}
                                        commentId={comment.commentId}
                                        onWrite={handleReplyWrite}
                                    />
                                }
                            </div>
                            {replys && replys.map((reply) => (reply.commentId === comment.commentId ?
                                (
                                    <div key={reply.idx} className='ml-4 flex justify-start items-start w-full'>
                                        <div>
                                            <ArrowTurnDownRightIcon className='w-4 h-4 mr-1 mt-2' />
                                        </div>
                                        <div className='w-full'>
                                            <ReplyView
                                                replysID={replysID}
                                                reply={reply}
                                                lineBreak={LineBreak}
                                                commentNickname={comment.nickname}
                                                handleDelete={handleReplyDelete}
                                                handleEdit={handleReplyEdit} />
                                        </div>
                                    </div>
                                )
                                : ""))
                            }
                        </div>
                    ))}

                    {/* 페이지네이션 */}
                    <div className="flex justify-between items-center mt-4">
                        <div className='w-full flex justify-center items-center'>
                            {page && <Paging
                                activePage={page.number + 1}
                                itemsCountPerPage={page.size}
                                totalItemsCount={page.totalElements}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageChange}
                                activeLinkClass={'bg-gray-400 rounded px-1 py-0.5'}
                                onClick={() => { handleScroll("comment") }}
                            />
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default CommentView;
