import React from 'react'
import { PencilSquareIcon, TrashIcon, AtSymbolIcon } from '@heroicons/react/24/outline';
import ReplyEdit from '../Form/ReplyEdit';

const ReplyView = ({ replysID, reply, lineBreak, commentNickname, handleDelete, handleEdit }) => {
    const nickname = sessionStorage.getItem("user");
    const CheckAdmin = sessionStorage.getItem("CheckAdmin");

    return (
        <div>
            <div className="text-start text-sm font-bold">{reply.nickname}{reply.edited && !reply.deleted ?<span className='text-xs font-thin text-gray-500 ml-2'>(댓글 수정됨)</span>:null}</div>
            <div className='flex'>
                <div className="flex text-start w-full">
                    <div className='w-11/12 break-all flex'>
                        {replysID === reply.idx ?
                            <div className='w-full'><ReplyEdit replyIdx={reply.idx} commentId={reply.commentId} content={reply.content} onWrite={handleEdit} /></div>
                            : <span id="nickname" className='text-sm w-full justify-start'>
                                <span className='text-blue-700 hover:bg-gray-400 transition-colors duration-75
                                 bg-zinc-400 bg-opacity-50 rounded-md pb-[1px] px-[3px] mr-1'>#{commentNickname}</span>
                                <span>{lineBreak(reply.content)}</span>
                            </span>}
                    </div>
                </div>
                <div className='flex mr-6 justify-end gap-4 items-center w-2/12 text-xs'>
                    <div>{((reply.nickname === nickname && !reply.deleted) ||
                        (CheckAdmin === 'X' && !reply.deleted)) ?
                        <label><PencilSquareIcon
                            className='w-4 h-4'
                            onClick={() => handleEdit(reply.idx)} />
                        </label>
                        : <div className='px-2' />}
                    </div>
                    <div>{((reply.nickname === nickname && !reply.deleted) ||
                        (CheckAdmin === 'X' && !reply.deleted)) ?
                        <label>
                            <TrashIcon
                                className='w-4 h-4'
                                onClick={() => handleDelete(reply.idx)} />
                        </label>
                        : <div className='px-2' />}
                    </div>
                </div>
            </div>
            <div className="text-gray-500 text-xs text-right mr-6">{new Date(reply.writtenDate).toLocaleString()}</div>
        </div>


    )
}

export default ReplyView
