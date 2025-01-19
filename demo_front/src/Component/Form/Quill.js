import React, { useMemo, useRef, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css';
import DOMPurifying from '../Util/DOMPurifying'
import axios from 'axios';
import Spinner from '../UI/Spinner';
import YoutubeLinkToTag from '../Util/YoutubeLinkToTag';

const Quill = ({ input, currentValue }) => {

    const [loading, setLoading] = useState(false);

    const quillRef = useRef();
    // customAxios가 적용안됨, 이유를 모르겠음
    const URL = process.env.REACT_APP_SPRING_SERVER;
    // axios용 헤더
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': sessionStorage.getItem('token')
    }

    // 입력값 처리
    const handleInput = (e) => {
        DOMPurifying(input(YoutubeLinkToTag(e)))
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
            const formData = new FormData();
            let img_resp = null;
            formData.append("file", file);
            // Ref를 이용한 quill editor 속성 들고오기
            const editor = quillRef.current.getEditor();
            // 에디터의 현재커서 위치값 가져오기
            const range = editor.getSelection();
            setLoading(true);
            await axios.post(URL + 'board/image/upload', formData, { headers })
                .then((resp) => {
                    img_resp = resp.data;
                })
                .catch((error) => {
                    alert(error.response.data);
                    setLoading(false);
                })
            // 가져온 위치에 업로드한 이미지 삽입
            editor.insertEmbed(range && range.index, 'image', URL + 'board/image/' + img_resp);
            // 삽입 후 커서 위치를 이미지 뒤로 이동 (이미지의 길이를 1로 계산)
            editor.setSelection(range.index + 1, 0); // 커서를 이미지 뒤로 이동
            editor.insertText(range.index + 1, "\n\n"); // 한줄 추가
            setLoading(false);
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
        <>
            <div className='relative'>
                <ReactQuill
                    ref={quillRef}
                    className="h-[30vh] sm:h-[40vh] md:h-[40vh] lg:h-[40vh] xl:h-[45vh] w-full"
                    modules={modules}
                    readOnly={loading}
                    defaultValue={currentValue ? currentValue : null}
                    theme="snow"
                    onChange={handleInput} />
                {loading && (
                    <div className='absolute flex top-0 -bottom-16 xl:-bottom-10
                    justify-center items-center z-0 bg-opacity-50 bg-white w-full'>
                        <Spinner width={8} height={8} border={3} />
                    </div>)}
            </div>
        </>
    )
}
export default Quill
