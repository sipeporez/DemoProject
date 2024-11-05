import React from 'react'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

const ToDoComponent = ({inputData, toDoIdx, checked, checkHandler, editHandler, deleteHandler}) => {
    return (
        <div className='flex justify-center my-2'>
        <div className='flex rounded-2xl bg-slate-500 bg-opacity-85 w-11/12 shadow-md'>
            <div className="flex flex-1 items-center my-2">
                <input id={toDoIdx}
                    type="checkbox"
                    checked={checked}
                    onChange={() => {checkHandler(toDoIdx)}}
                    className="ml-6 w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label
                    htmlFor={toDoIdx}
                    className={`mx-4 py-2 text-lg font-bold dark:text-gray-300 break-all
                        ${checked ? 'line-through text-gray-600'
                        :'text-gray-900'}`}>{inputData}</label>
            </div>
            <div className='flex items-center mr-4 gap-2'>
                <PencilSquareIcon className='w-8 h-8 text-blue-400' onClick={() => {editHandler(toDoIdx)}} />
                <TrashIcon className='w-8 h-8 text-red-600' onClick={()=>{deleteHandler(toDoIdx)}} />
            </div>
        </div>
        </div>
    )
}

export default ToDoComponent
