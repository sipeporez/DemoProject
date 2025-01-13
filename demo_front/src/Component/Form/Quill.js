import React, { useMemo, useRef, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css';
import DOMPurifying from '../Util/DOMPurifying'
import axios from 'axios';

const Quill = ({ input, currentValue }) => {
    let fileCount = 0;
    const quillRef = useRef();
    // customAxios가 적용안됨, 이유를 모르겠음
    const URL = process.env.REACT_APP_SPRING_SERVER;
    // axios용 헤더
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': sessionStorage.getItem('token')
    }

    const handleInput = (e) => {
        DOMPurifying(input(e.replace(/&lt;/g, "<").replace(/&gt;/g, ">")))
    }

    const imageHandler = () => {
        // input 태그에 속성값 추가하여 파일 선택창 출력
        const inputHandle = document.createElement('input');
        inputHandle.setAttribute('type', 'file');
        inputHandle.setAttribute('accept', '.bmp, .jpg, .jpeg, .png, .gif, .webp');
        inputHandle.click();

        // 선택한 파일 핸들링
        inputHandle.addEventListener('change', async () => {
            const file = inputHandle.files[0]; // 선택한 파일
            const fileSize = file.size;
            if (fileSize > 10485760) {
                alert("업로드 할 수 있는 이미지의 크기는 최대 10MB 입니다.")
                return;
            }
            if (fileCount > 4) {
                alert("한 게시글 당 5개의 이미지만 업로드 가능합니다.")
                return;
            }
            const formData = new FormData();
            let img_resp = null;
            formData.append("file", file);
            await axios.post(URL + 'board/image/upload', formData, { headers })
                .then((resp) => {
                    img_resp = resp.data;
                    fileCount++;
                })
                .catch((error) => { alert(error.response.data) })

            // Ref를 이용한 quill editor 속성 들고오기
            const editor = quillRef.current.getEditor();
            // 에디터의 현재커서 위치값 가져오기
            const range = editor.getSelection();
            // 가져온 위치에 업로드한 이미지 삽입
            editor.insertEmbed(range.index, 'image', URL + 'board/image/' + img_resp);
            // 삽입 후 커서 위치를 이미지 뒤로 이동 (이미지의 길이를 1로 계산)
            editor.setSelection(range.index + 1, 0); // 커서를 이미지 뒤로 이동
            // editor.insertEmbed(range.index + 1, "\n"); // 한줄 추가
        })
    }



    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    [{ 'align': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    ['link', 'image'],
                    ['clean']                                         // remove formatting button
                ],
                handlers: {
                    'image': imageHandler,
                },
            }
        }
    }, []);

    return (
        <ReactQuill
            ref={quillRef}
            className="h-[30vh] sm:h-[40vh] md:h-[40vh] lg:h-[40vh] xl:h-[45vh] w-full"
            modules={modules}
            defaultValue={currentValue ? currentValue : null}
            theme="snow"
            onChange={handleInput} />

    )
}
export default Quill
