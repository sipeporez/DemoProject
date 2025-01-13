import React, { useEffect, useState } from 'react';
import { CustomAxios } from '../CustomAxios';

const FileDropdown = ({ boardIdx }) => {
    const URL = process.env.REACT_APP_SPRING_SERVER;
    const [isOpen, setIsOpen] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        handleFileList();
    }, [boardIdx])

    const toggleDropdown = () => {
        setIsOpen((item) => !item);
    };

    const makeDownloadLink = (data) => {
        window.location.href = URL + "board/image/" + data + "?d=true";
    }

    const handleFileList = async () => {
        try {
            await CustomAxios({
                methodType: "GET",
                backendURL: `board/${boardIdx}/filelist`,
                onResponse: (resp) => {
                    setFileList(resp);
                }
            })
        } catch (error) {
            alert(error.resp.data);
        }
    }

    const convertFileSize = (data) => {
        if (data > 1048576) {
            return Math.round((data / 1024 / 1024)).toLocaleString() + "MB"
        }
        else return Math.round((data / 1024)).toLocaleString() + "KB"
    }

    return (
        <div className="relative inline-block text-left float-end mr-3 pb-2">
            <div>
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2">
                    <div className="text-xs font-Pretendard font-medium text-gray-800 transition-colors delay-5 hover:text-gray-500">
                        첨부파일
                    </div>
                </button>
            </div>
            <div className={`absolute right-0 z-10 w-56 rounded-md bg-white shadow-lg 
            transition-opacity duration-200 ease-in-out ${isOpen ? 'opacity-100 z-20' : 'opacity-0 z-0 pointer-events-none'}`}>
                <div>
                    {fileList && fileList.map((item) => (
                        <div key={item.storedName}
                            onClick={() => { makeDownloadLink(item.storedName) }}
                            className="flex justify-between items-center px-3 py-2 rounded-md text-xs text-gray-700 
                            hover:bg-gray-100 hover:text-gray-900 hover:outline-none hover:cursor-pointer">
                            <div>{item.originalName.length > 15 ?
                                item.originalName.slice(0, 14) + "..." + item.originalName.slice(item.originalName.length - 10, item.originalName.length)
                                : item.originalName}
                            </div>
                            <div>({convertFileSize(item.fileSize)})</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileDropdown;
