import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import { CustomAxios } from '../CustomAxios';
import CustomButton from '../UI/CustomButton';
import { useRecoilValue } from 'recoil';
import { LoginState } from '../../Recoil/LoginStateAtom';

const BoardDeleteModal = ({ boardIdx, nickname }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
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

    const handleDelete = async () => {
        if (sessionStorage.getItem("user") === nickname ||
            sessionStorage.getItem("CheckAdmin") === "X") {
            try {
                await CustomAxios({
                    methodType: "DELETE",
                    backendURL: `board/delete/${boardIdx}`,
                    onResponse: (resp) => {
                        alert(resp); // 게시글 삭제 완료 alert
                        setOpen(false);
                        window.location.href = '/home';
                    }
                })
            } catch (error) {
                alert(error.response.data);
                return;
            }
        }
    }
    return (
        <div>
            <CustomButton label={"삭제"} onClick={handleOpen} c="red" />
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
                        <div className='text-xl font-bold text-center my-2'>
                            게시글을 <span className='text-red-700'>삭제</span> 하시겠습니까?
                        </div>
                        <div className='flex justify-around items-center pt-6'>
                            <CustomButton label={"삭제"} onClick={handleDelete} c="red" />
                            <CustomButton label={"취소"} onClick={handleClose} />
                        </div>

                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
export default BoardDeleteModal
