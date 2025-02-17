import React, { useEffect, useRef, useState } from 'react'
import InfinityContent from './InfinityContent'
import { CustomAxios } from '../CustomAxios';
import Spinner from '../UI/Spinner';

// 무한 스크롤
const InfinityBase = () => {
    // fetch시 로딩
    const [loading, setLoading] = useState(false);
    // 게시글 마지막 페이지 저장용
    const [pageList, setPageList] = useState([]);
    // fetch 데이터
    const [data, setData] = useState([]);
    // 마지막 페이지와 현재 페이지 비교용
    const [hasNextPage, setHasNextPage] = useState(true);
    // fetch용 페이지
    const [page, setPage] = useState('');
    // Intersection Observer용 Ref (HTML Element)
    const target = useRef('');

    // 첫 페이지 로딩시 게시글 번호 리스트 가져오기
    useEffect(() => {
        findBoardLastIdx();
    }, [])

    // 페이지 리스트 끝날 시 게시글 번호 리스트 이어서 가져오기
    useEffect(() => {
        if (page !== 1) {
            if (page && pageList && pageList.length < 1) {
                findBoardLastIdxContinue(page);
            }
        }
    }, [page, pageList])

    // 무한 스크롤 구현 (Intersection Observer) - 내림차순
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            // 현재 페이지가 1인 경우 fetch 멈춤
            if (page && page === 1) {
                setHasNextPage(false);
                return;
            }
            // shift로 배열에 저장된 글 번호 가져오기 (앞 순서부터 제거)
            if (entry.isIntersecting && !loading && hasNextPage && pageList.length !== 0) {
                const currentPage = pageList.shift();
                setPage(currentPage);
                fetchData(currentPage);
            }
        });
        const targetForCleanup = target.current;
        // 뷰포트에 Element 감지될 경우 observe 
        if (targetForCleanup) observer.observe(targetForCleanup);
        // 클린업 함수 (기존 observe 해제하여 메모리 누수 방지)
        // 아래 의존성 배열 값 바뀔때마다 observe 재생성->클린업 반복
        return () => {
            if (targetForCleanup) observer.unobserve(targetForCleanup);
        }
    }, [hasNextPage, loading, pageList, page])

    // 최초로 페이지 로드 시 idx 리스트 들고오는 함수
    const findBoardLastIdx = async () => {
        try {
            await CustomAxios({
                methodType: "GET",
                backendURL: "board/last",
                onResponse: (resp) => {
                    setPageList(resp);
                }
            })
        } catch (error) {
            alert(error.response.data);
        }
    }

    // 마지막 게시글 번호 이어서 불러오는 함수
    const findBoardLastIdxContinue = async (page) => {
        try {
            await CustomAxios({
                methodType: "GET",
                backendURL: `board/last/${page}`,
                onResponse: (resp) => {
                    setPageList(resp);
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
            // fetch 데이터 임의 지연 (무한 스크롤 효과)
            setTimeout(() => {
                setLoading(false)
            }, 200)
            // setLoading(false)
        } catch (error) {
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
            setLoading(false)
        }
    }

    return (
        <div className='ml-0 lg:ml-32 xl:ml-48'>
            <div className='w-full justify-center h-fit'>
                {data && data.map((item) => {
                    return (
                        <div className='w-full mb-10' key={item.idx}>
                            <InfinityContent data={item} />
                        </div>)
                })
                }
                <div className='flex justify-center items-center' ref={target} >
                    {/* 스크롤 시 로딩바 생성, 로딩바 y 크기에 맞출 것 (깜빡임 수정) */}
                    {loading ?
                        <div className='block'><Spinner width={8} height={8} border={4} /></div>
                        :
                        <div className='h-9' />}
                </div>
            </div>
        </div>
    )
}

export default InfinityBase