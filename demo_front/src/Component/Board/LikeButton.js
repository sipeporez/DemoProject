import React, { useEffect, useState } from 'react';
import { CustomAxios } from '../CustomAxios';

const LikeButton = ({boardIdx, likeCnt}) => {
  const [liked, setLiked] = useState('');
  const [count, setCount] = useState(likeCnt);
  const checkLogin = sessionStorage.getItem('token');

  const fetchLike = () => {
    CustomAxios({
        methodType:"PUT",
        backendURL:`board/like/${boardIdx}`
    })
  }
  const fetchCheckLike = () => {
    CustomAxios({
        methodType:"GET",
        backendURL:`board/like/${boardIdx}/check`,
        onResponse: handleFetchGetLike
    })
  }
  const handleFetchGetLike = (response) => {
    setLiked(response)
  }
  useEffect(()=> {
    setCount(likeCnt)
    if (checkLogin) {
      fetchCheckLike();
    }
  },[boardIdx, likeCnt])

  const handleLike = () => {
    if(checkLogin) {
      setLiked(prevLiked => !prevLiked);
      setCount(prevCount => (liked ? prevCount - 1 : prevCount + 1));
      fetchLike();
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
