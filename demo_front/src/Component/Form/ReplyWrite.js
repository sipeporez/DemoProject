import React, { useRef } from 'react';
import { CustomAxios } from '../CustomAxios';
import CustomButton from '../UI/CustomButton';

const ReplyWrite = ({ boardIdx, commentId, onWrite }) => {
    const checkLogin = sessionStorage.getItem('token');
    const inputData = useRef('');

    // Enter키 입력을 감지하는 부분
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleWrite();
        }
    };

    const handleWrite = async (e) => {
        if (checkLogin) {
            if (inputData.current.value.trim() !== "") {
                try {
                    await CustomAxios({
                        methodType: 'POST',
                        backendURL: `reply/write`,
                        fetchData: { "boardIdx": boardIdx,
                            "commentId":commentId,
                            "content": inputData.current.value },
                        onResponse: () => {
                            inputData.current.value = null;
                            onWrite(); // 상위 컴포넌트(CommentView)에서 전달받은 콜백함수
                        }
                    })
                } catch (error) {
                    alert(error.response.data);
                }
            }
            else {
                alert("빈 댓글은 등록할 수 없습니다.");
                return;
            }
        }
        else {
            alert("로그인 후 이용 가능합니다.");
            return;
        }
    }

    return (
        <div>
            <div className='flex flex-col justify-end w-full'>
                <form>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
                    <textarea
                        ref={inputData}
                        rows="3"
                        className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="댓글 입력"
                        maxLength={500}
                        onKeyDown={(e) => { handleKeyDown(e) }}></textarea>
                </form>
                <div className='flex mt-2 justify-end'>
                    <CustomButton label={"답글 쓰기"} onClick={handleWrite} />
                </div>
            </div>
        </div>

    )
}

export default ReplyWrite
