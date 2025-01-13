import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomAxios } from '../CustomAxios';
import ToDoComponent from './ToDoComponent';
import useLoginCheck from '../Hooks/useLoginCheck';
import CheckEnabled from '../Util/CheckEnabled';

const ToDoBase = () => {
    // todo 리스트 배열에 대한 상태
    const [todos, setTodos] = useState([]);
    // 새 할 일 등록시 필요한 input Ref
    const inputData = useRef();

    useLoginCheck();
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
        // 비동기 처리 (1. enabled 확인 / 2. DB 데이터 가져오기)
        const checkDB = async () => {
            await CheckEnabled();
            await getToDoData();
        }
        checkDB();
    }, [])
    
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
            if (error.response.status === 401) {
                alert(error.response.data)
                window.location.href = "/home"
            }
            return;
        }
    }

    // 새 ToDo 추가
    const addNewToDo = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
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
                        inputData.current.value = null
                    }
                })
            } catch (error) {
                alert(error.response.data)
                return;
            }
        }
    }

    return (
        <div className='flex flex-col justify-start items-center'>
            <div className='flex flex-col my-4 justify-center items-center w-full md:w-2/3 ml-0 lg:ml-32 xl:ml-48'>
                <label className="block m-4 text-2xl font-bold text-gray-200 dark:text-white font-Pretendard">To-Do List</label>
                <textarea
                    ref={inputData}
                    rows="2"
                    maxLength={100}
                    className="resize-none p-2.5 w-11/12 md:w-3/4 text-sm
                        text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="새 할 일을 입력 해주세요.&#13;&#10;Shift+Enter 입력시 줄바꿈, Enter 입력시 등록"
                    onKeyDown={(e) => { addNewToDo(e) }}
                    form='todoInput'>
                </textarea>
            </div>
            <div className='flex justify-center items-start bg-gray-200 w-full ml-0 lg:ml-32 xl:ml-48 min-[900px]:w-2/3 h-full mb-5'>
                <div className='flex-col flex-1 justify-center items-center'>
                    {todos.map(todo => (
                        <div className='my-2.5' key={todo.idx}>
                            <ToDoComponent
                                toDoIdx={todo.idx}
                                inputData={todo.content}
                                checked={todo.completed}
                                checkHandler={checkHandler}
                                editHandler={editHandler}
                                deleteHandler={deleteHandler}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ToDoBase;