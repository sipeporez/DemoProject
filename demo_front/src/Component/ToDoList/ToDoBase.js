import React, { useState, useRef, useEffect } from 'react';
import CustomButton from '../UI/CustomButton';
import ToDoComponent from './ToDoComponent';
import { CustomAxios } from '../CustomAxios';
import NavBar from '../UI/NavBar';
import { useNavigate } from 'react-router-dom';

const ToDoBase = () => {
    // todo 리스트 배열에 대한 상태
    const [todos, setTodos] = useState([]);
    // DB에서 가져온 데이터
    const [getData, setGetData] = useState([]);
    // 새 할 일 등록시 필요한 input Ref
    const inputData = useRef();
    const navigate = useNavigate();

    // 체크 핸들러
    const checkHandler = async (toDoIdx) => {
        const selected = todos.map(item => item.idx === toDoIdx ?
            { ...item, completed: !item.completed }
            : item
        );
        try {
            await CustomAxios({
                methodType: "PUT",
                backendURL: "todo/check",
                fetchData: { "idx": toDoIdx }
            })
        } catch (error) {
            alert(error.response.data)
            return;
        }
        setTodos(selected);
    }

    // 수정 핸들러
    const editHandler = async (toDoIdx) => {
        const selected = todos.find(todos => todos.idx === toDoIdx)
        // 프롬프트를 이용하여 내용 수정
        let newContent = prompt("수정할 내용 입력", selected.content);
        if (newContent !== null && newContent !== selected.content) {
            selected.content = newContent;
        } 
        else return;
        
        try {
            await CustomAxios({
                methodType: "PUT",
                backendURL: "todo/edit",
                fetchData: {
                    "idx": toDoIdx,
                    "content": selected.content
                }
            })
        } catch (error) {
            alert(error.response.data)
            return;
        }
        // setTodos를 사용해 todos 배열을 업데이트
        setTodos([...todos])
    }

    // 삭제 핸들러
    const deleteHandler = async (toDoIdx) => {
        try {
            await CustomAxios({
                methodType: "DELETE",
                backendURL: `todo/delete/${toDoIdx}`
            })
        } catch (error) {
            alert(error.response.data)
            return;
        }
        setTodos(prevTodos => prevTodos.filter(todo => todo.idx !== toDoIdx))
    }

    // 페이지 최초 로드 시 DB에서 데이터 가져오기
    useEffect(() => {
        getToDoData()
    },[])

    // DB 저장된 데이터 가져오기
    const getToDoData = async () => {
        try {
            await CustomAxios({
                methodType: "GET",
                backendURL: "todo/get",
                onResponse: (resp) => {
                    setTodos(resp);
                }
            })
        } catch (error) {
            alert(error.response.data)
            if (error.response.status === 401) navigate("/")
            return;
        }
    }

    // 새 ToDo 추가
    const addNewToDo = async () => {
        if (todos.length > 9) {
            alert("최대 10개까지 추가 가능합니다.")
            return;
        }
        if (inputData.current.value.trim() === "") {
            alert("할 일을 입력해주세요.")
            return;
        }
        const newToDo = {
            content: inputData.current.value
        };
        try {
            await CustomAxios({
                methodType: "POST",
                backendURL: "todo/post",
                fetchData: newToDo,
                onResponse: (resp) => {
                    const newToDoWithIdx = { ...newToDo, idx: resp };
                    setTodos(prevTodos => [...prevTodos, newToDoWithIdx])
                }
            })
        } catch (error) {
            alert(error.response.data)
            return;
        }
    }

    return (
        <>
            <header>
                <NavBar />
            </header>
            <div className='flex flex-col justify-start items-center w-screen min-h-screen'>
                <div className='flex w-1/3 my-4 gap-2 justify-center items-center'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
                    <textarea
                        ref={inputData}
                        rows="2"
                        maxLength={100}
                        className="block resize-none p-2.5 w-4/5 text-sm
                        text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="새 할 일"
                        defaultValue={"새 할 일"}></textarea>
                    <CustomButton onClick={addNewToDo} label={'추가'} />
                </div>
                <div className='flex justify-center items-start bg-gray-200 w-1/2 h-full'>
                    <div className='flex-col flex-1 justify-center items-center'>
                        {todos.map(todo => (
                            <ToDoComponent
                                key={todo.idx}
                                toDoIdx={todo.idx}
                                inputData={todo.content}
                                checked={todo.completed}
                                checkHandler={checkHandler}
                                editHandler={editHandler}
                                deleteHandler={deleteHandler}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ToDoBase;