import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import React, { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { LoginState } from '../../Recoil/LoginStateAtom';
import { CustomAxios } from '../CustomAxios';
import CustomButton from '../UI/CustomButton';
import CheckEnabled from '../Util/CheckEnabled';
import Quill from './Quill';


const BoardWriteModal = () => {

    const checkLogin = useRecoilValue(LoginState)
    const [content, setContent] = useState('');
    const [fileList, setFileList] = useState([]);
    const URL = process.env.REACT_APP_SPRING_SERVER;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '@media (max-width: 768px)': {
            width: '80%'
        },
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        if (checkLogin) {
            setOpen(true);
        }
        else {
            alert("로그인 후 이용 가능합니다.");
            return;
        }
    }
    const handleClose = () => setOpen(false);
    const inputTitle = useRef('');

    // fileList 관리용 이미지 경로 추출
    const extractImageName = (e) => {
        const regex = new RegExp(`<img src="${URL}([^"]+)">`, 'g');
        const matches = [...e.matchAll(regex)];
        // 매칭된 결과에서 파일 이름만 추출
        matches.map(match => {
            const fullUrl = match[1];  // 정규식 그룹으로 URL 부분만 추출
            const filename = fullUrl.split('/').pop();  // 마지막 '/' 이후의 부분이 파일 이름
            fileList.push(filename);
        });
    }

    const handleWrite = async () => {
        await CheckEnabled();
        if (inputTitle.current.value.trim() !== "" && content !== "") {
            // 입력된 내용을 정규식 검사하여 이미지 업로드한 경우 fileList에 이미지 이름 추가
            extractImageName(content);
            try {
                await CustomAxios({
                    methodType: "POST",
                    backendURL: "board/write",
                    fetchData: {
                        title: inputTitle.current.value,
                        content: content
                    },
                    onResponse: async (resp) => {
                        // 이미지를 업로드 한 경우 게시글 번호 업데이트
                        if (fileList.length > 0) {
                            try {
                                await CustomAxios({
                                    methodType: "PUT",
                                    backendURL: "board/image/update",
                                    fetchData: {
                                        boardIdx: resp,
                                        fileList: fileList
                                    }
                                })
                            }
                            catch (error) {
                                alert("이미지 업로드 중 에러가 발생했습니다.");
                            }
                        }
                        setFileList([]);
                        alert("게시글 작성 완료"); // 게시글 작성 완료 alert
                        setOpen(false);
                        window.location.href = '/home';
                    }
                })
            } catch (error) {
                alert(error.response.data);
                return;
            }
        }
        else {
            alert("글 제목과 내용을 입력해주세요.");
            return;
        }
    }
    return (
        <div>
            <CustomButton label={"게시글 등록"} onClick={handleOpen} ></CustomButton>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                className='ml-0 lg:ml-32 xl:ml-48'
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <div className='text-xl font-bold'>
                            게시글 등록
                        </div>
                        <form className="max-w-full flex-col">
                            <div className="relative z-0 w-full mt-4 mb-3 group">
                                <textarea
                                    ref={inputTitle}
                                    rows="1"
                                    className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="글 제목"
                                    maxLength={100}></textarea>
                            </div>
                            <div className="relative z-0 w-full mb-3 group">
                                <div className='w-full min-h-[50vh]'><Quill input={setContent} /></div>
                            </div>
                            <div className='float-right'>
                                <CustomButton label={"글 등록"} onClick={handleWrite} />
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
export default BoardWriteModal
