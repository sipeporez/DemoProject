import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import React, { useRef, useState } from 'react';
import { CustomAxios } from '../CustomAxios';
import CustomButton from '../UI/CustomButton';
import { useRecoilValue } from 'recoil';
import { LoginState } from '../../Recoil/LoginStateAtom';

const BoardEditModal = ({ boardIdx, title, content }) => {
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

    const checkLogin = useRecoilValue(LoginState);

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
    const inputContent = useRef('');

    const handleEdit = async () => {
        if (inputTitle.current.value.trim() !== "" &&
            inputContent.current.value.trim() !== "") {
            try {
                await CustomAxios({
                    methodType: "PUT",
                    backendURL: `board/edit/${boardIdx}`,
                    fetchData: {
                        title: inputTitle.current.value,
                        content: inputContent.current.value
                    },
                    onResponse: (resp) => {
                        alert(resp); // 게시글 작성 완료 alert
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
            <CustomButton label={"수정"} onClick={handleOpen} />
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
                            게시글 수정
                        </div>
                        <form className="max-w-full flex-col">
                            <div className="relative z-0 w-full mt-4 mb-3 group">
                                <textarea
                                    ref={inputTitle}
                                    rows="1"
                                    className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="글 제목"
                                    defaultValue={title}
                                    maxLength={100}></textarea>
                            </div>
                            <div className="relative z-0 w-full mb-3 group">
                                <textarea
                                    ref={inputContent}
                                    rows="10"
                                    className="block resize-y min-h-20 max-h-[70vh] p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="글 내용"
                                    defaultValue={content}
                                    maxLength={5000}></textarea>
                            </div>
                            <div className='float-right'>
                                <CustomButton label={"글 수정"} onClick={handleEdit} />
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
export default BoardEditModal
