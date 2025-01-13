import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import LikeButton from '../Board/LikeButton';
import DOMPurifying from '../Util/DOMPurifying';

const InfinityContent = ({ data }) => {

    return (
        <div className='flex justify-center items-center pt-5'>
            {data &&
                <div className="flex flex-col bg-gray-300 rounded-lg w-full md:w-2/3 max-w-screen-xl">
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
                    <div className="text-lg text-start mx-3 mb-3 break-words"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurifying(data.content)
                        }}>
                    </div>
                    <div className="flex justify-end items-end mx-3 mb-3">
                        {<LikeButton boardIdx={data.idx} likeCnt={data.likeCnt} />}
                    </div>
                </div>
            }
        </div>
    )
}

export default InfinityContent
