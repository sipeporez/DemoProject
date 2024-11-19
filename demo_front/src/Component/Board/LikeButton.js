import React, { useEffect, useState } from 'react';
import { CustomAxios } from '../CustomAxios';
import { useRecoilValue } from 'recoil';
import { LoginState } from '../../Recoil/LoginStateAtom';

const LikeButton = ({ boardIdx, likeCnt }) => {
  const [liked, setLiked] = useState('');
  const [count, setCount] = useState(likeCnt);
  const checkLogin = useRecoilValue(LoginState);

  // 좋아요 DB Fetch
  const putLike = async () => {
    try {
      await CustomAxios({
        methodType: "PUT",
        backendURL: `board/like/${boardIdx}`
      })
    }
    catch (error) {
      alert(error.response.data)
      throw error;
    }
  }

  // 회원이 이미 좋아요를 눌렀는지 확인하기
  const checkLiked = async () => {
    try {
      await CustomAxios({
        methodType: "GET",
        backendURL: `board/like/${boardIdx}/check`,
        onResponse: (resp) => {
          setLiked(resp)
        }
      })
    }
    catch (error) {
    }
  }

  useEffect(() => {
    setCount(likeCnt)
    if (checkLogin) {
      checkLiked();
    }
  }, [boardIdx, likeCnt])

  // 좋아요 버튼 클릭시 작동
  const handleLike = async () => {
    if (checkLogin) {
      try {
        await putLike();
        setLiked(prevLiked => !prevLiked);
        setCount(prevCount => (liked ? prevCount - 1 : prevCount + 1));
        return;
      }
      catch (error) {
        return;
      }
    }
    else {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
  };

  return (
    <button
      className={`flex items-center border-none rounded-md py-1 px-2 cursor-pointer transition-colors duration-300`}
      onClick={handleLike}
    >
      <span className={`text-xl mr-1 ${liked ? 'text-red-500' : ''}`}>
        {liked ? '❤️' : '🤍'}
      </span>

      <span className="bg-gray-400 rounded-full py-1 px-3 text-sm">{count}</span>
    </button>
  );
};

export default LikeButton;
