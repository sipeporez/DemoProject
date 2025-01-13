import React, { useEffect, useRef, useState } from 'react'
import InfinityContent from './InfinityContent'
import { CustomAxios } from '../CustomAxios';
import Spinner from '../UI/Spinner';
import BoardView from '../Board/BoardView';

// 무한 스크롤 테스트 페이지

const InfinityBase = () => {
    // fetch시 로딩
    const [loading, setLoading] = useState(false);
    // 게시글 마지막 페이지 저장용
    const [lastPage, setLastPage] = useState(null);
    // fetch 데이터
    const [data, setData] = useState([]);
    // 마지막 페이지와 현재 페이지 비교용
    const [hasNextPage, setHasNextPage] = useState(true);

    // fetch용 페이지
    const page = useRef('');
    // Intersection Observer용 Ref (HTML Element)
    const target = useRef('');

    // 첫 페이지 로딩시 마지막 게시글 번호 가져오기
    useEffect(() => {
        findBoardLastIdx();
    }, [])

    // 무한 스크롤 구현 (Intersection Observer) - 오름차순
    // useEffect(() => {
    //     const observer = new IntersectionObserver((entries) => {
    //         const entry = entries[0]
    //         // 마지막 페이지보다 현재 페이지가 커질 경우 fetch 멈춤
    //         if (lastPage && lastPage < page.current) {
    //             setHasNextPage(false);
    //         }
    //         // 데이터 가져온 뒤 page +1
    //         if (entry.isIntersecting && page.current && hasNextPage && !loading) {
    //             fetchData(page.current);
    //             page.current += 1;
    //         }
    //     });
    //     // 뷰포트에 Element 감지될 경우 observe 
    //     if (target.current) observer.observe(target.current);
    //     // 클린업 함수 (기존 observe 해제하여 메모리 누수 방지)
    //     // 아래 의존성 배열 값 바뀔때마다 observe 재생성->클린업 반복
    //     return () => {
    //         if (target.current) observer.unobserve(target.current);
    //     }
    // }, [lastPage, hasNextPage, loading])

    // 무한 스크롤 구현 (Intersection Observer) - 내림차순
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            // 현재 페이지가 1보다 작을경우 fetch 멈춤
            if (lastPage && page.current < 1) {
                setHasNextPage(false);
            }
            // 데이터 가져온 뒤 page -1
            if (entry.isIntersecting && page.current && hasNextPage && !loading) {
                fetchData(page.current);
                page.current -= 1;
            }
        });
        // 뷰포트에 Element 감지될 경우 observe 
        if (target.current) observer.observe(target.current);
        // 클린업 함수 (기존 observe 해제하여 메모리 누수 방지)
        // 아래 의존성 배열 값 바뀔때마다 observe 재생성->클린업 반복
        return () => {
            if (target.current) observer.unobserve(target.current);
        }
    }, [lastPage, hasNextPage, loading])

    // 마지막 게시글 번호 불러오는 함수
    const findBoardLastIdx = async () => {
        try {
            await CustomAxios({
                methodType: "GET",
                backendURL: "board/last",
                onResponse: (resp) => {
                    setLastPage(parseInt(resp));
                    page.current = parseInt(resp); // 내림차순 정렬용
                }
            })
        } catch (error) {
            alert(error.response.data);
        }
    }

    // 게시글 데이터 불러오는 함수
    const fetchData = async (page) => {
        setLoading(true)
        try {
            await CustomAxios({
                methodType: "GET",
                backendURL: `board/view/${page}`,
                onResponse: (resp) => {
                    setData((data) => [...data, resp]);
                }
            })
            // fetch 데이터 임의 지연
            setTimeout(() => {
                setLoading(false)
            }, 500)
        } catch (error) {
            setLoading(false)
        }
    }

    return (
        <div className='ml-0 lg:ml-32 xl:ml-48'>
            <div className='w-full justify-center h-fit'>
                {data && data.map((item) => {
                    return (
                        <div className='w-full mb-20' key={item.idx}>
                            <InfinityContent data={item} />
                            {/* <BoardView boardIdx={page.current}/> */}
                        </div>)
                })
                }
                <div className='flex justify-center items-center' ref={target} >
                    {/* 스크롤 시 로딩바 생성, 로딩바 y 크기에 맞출 것 (깜빡임 수정) */}
                    {loading ?
                        <div className='block'><Spinner width={8} height={8} border={4} /></div>
                        :
                        <div className='h-9'/>}
                </div>
            </div>
        </div>
    )
}

export default InfinityBase