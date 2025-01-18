import React, { useEffect, useState } from 'react';
import { CustomAxios } from '../CustomAxios';
import BoardWriteModal from '../Form/BoardWriteModal';
import BoardView from './BoardView';
import TimeCalc from '../Util/TimeCalc';
import Paging from '../UI/Paging';
import { useRecoilValue } from 'recoil';
import { LoginState } from '../../Recoil/LoginStateAtom';
import SearchInput from '../Form/SearchInput';
import Spinner from '../UI/Spinner';
import { PhotoIcon } from '@heroicons/react/24/outline'

const BoardList = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState({
        number: 0,  // 초기 페이지 번호
        size: 10,   // 한 페이지에 표시할 항목 수
        totalElements: 0,  // 전체 항목 수
    });

    const [searchMode, setSearchMode] = useState(false);
    const [searchParams, setSearchParams] = useState({ type: "", keyword: "" });

    const [loading, setLoading] = useState(false);
    const [boardIdx, setBoardIdx] = useState('');
    const checkLogin = useRecoilValue(LoginState);

    // 페이지 최초 로딩 시 게시판 데이터 가져오기
    useEffect(() => {
        fetchData(page.number, page.size);
    }, []);

    // fetch Data
    const fetchData = async (page, size) => {
        setLoading(true);
        try {
            await CustomAxios({
                methodType: 'get',
                backendURL: `board/list?page=${page}&size=${size}`,
                onResponse: (resp) => {
                    setData(resp.content);
                    setPage({ ...resp.page });
                    setSearchMode(false);
                    setLoading(false);
                }
            });
        } catch (error) {
            setLoading(false);
            alert(error.response.data);
            return;
        }
    };

    // search Data
    const searchData = async (page, size) => {
        setLoading(true);
        try {
            await CustomAxios({
                methodType: 'get',
                backendURL: `board/search?page=${page}&size=${size}&type=${searchParams.type}&keyword=${searchParams.keyword}`,
                onResponse: (resp) => {
                    setData(resp.content);
                    setPage({ ...resp.page });
                    setLoading(false);
                }
            });
        } catch (error) {
            setLoading(false);
            alert(error.response.data);
            return;
        }
    };

    // SearchInput 컴포넌트용 핸들러
    // 타입과 키워드 저장 후 검색모드 활성화
    const handleSearch = (type, keyword) => {
        setSearchParams({ type, keyword });
        setSearchMode(true);
    };

    // 검색 결과 렌더링용 useEffect
    useEffect(() => {
        if (searchMode && searchParams.keyword !== "") {
            searchData(0, page.size);
        }
    }, [searchParams]);


    // 페이지네이션
    // 백앤드 pageNumber는 0부터 시작하므로 -1
    // 검색모드일 경우 searchData, 아닐경우 fetchData
    const handlePageChange = (pageNumber) => {
        if (searchMode) {
            searchData(pageNumber - 1, page.size);
        }
        else {
            fetchData(pageNumber - 1, page.size);
        }
    };

    // 게시글 클릭시 게시글 번호 저장 및 스크롤
    const handleBoardIdx = (idx) => {
        setBoardIdx(idx)
        window.scrollTo(0, 0)
    }
    return (
        <div className='ml-0 lg:ml-32 xl:ml-48 font-Pretendard'>
            {boardIdx &&
                <BoardView boardIdx={boardIdx} />}
            <div className="flex justify-center pt-5">
                <div className=" w-full md:w-2/3 max-w-screen-xl justify-center h-fit items-center">
                    <table className='bg-white rounded-t-lg shadow-md flex-1 w-full'>
                        <thead>
                            <tr className='text-center text-md border-b-gray-500 border-b-2'>
                                <th className='w-fit md:w-[50%] py-2'>제목</th>
                                <th className='w-fit md:w-[30%] '>닉네임</th>
                                <th className='w-fit md:w-[10%] '>작성일</th>
                                <th className='w-fit md:w-[10%] '>좋아요</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4">
                                        <div className="flex justify-center items-center py-[171px]">
                                            <Spinner height={8} width={8} border={4} />
                                        </div>
                                    </td>
                                </tr>
                            ) : (data && data.map((item) => (
                                <tr
                                    key={item.idx}
                                    onClick={() => handleBoardIdx(item.idx)}
                                    className='hover:bg-opacity-10 hover:bg-black duration-150 border-b-2 transition-colors break-all text-sm md:text-md'>
                                    <td className='text-start w-[30%] md:w-[50%] py-2 pl-2'>
                                        {item.title.length > 25 ?
                                            (<div className='flex'>
                                                {item.title.slice(0, 25) + '...'}
                                                {item.hasImage && <PhotoIcon className='w-4 mt-[1px]' />}
                                                <div className='justify-center items-center flex ml-3 text-gray-500'>
                                                    {item.commentCount !== 0 ? '  [' + item.commentCount + ']' : null}
                                                </div>
                                            </div>
                                            )
                                            : (
                                                <div className='flex'>
                                                    {item.title}
                                                    {item.hasImage && <PhotoIcon className='w-4 ml-2 mt-[1px]' />}
                                                    <div className='justify-center items-center flex ml-3 text-gray-500'>
                                                        {item.commentCount !== 0 ? '  [' + item.commentCount + ']' : null}
                                                    </div>
                                                </div>
                                            )}
                                    </td>
                                    <td className='text-center w-fit md:w-[30%] py-2'>{item.nickname.length > 10 ? item.nickname.slice(0, 10) + '...' : item.nickname}</td>
                                    <td className='text-center w-fit md:w-[10%] py-2'>{<TimeCalc time={item.writtenDate} />}</td>
                                    <td className='text-center w-fit md:w-[10%] py-2'>{item.likeCnt}</td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                    <div className='flex justify-center rounded-b-lg items-center bg-white'>
                        {page &&
                            <Paging
                                activePage={page.number + 1}
                                itemsCountPerPage={page.size}
                                totalItemsCount={page.totalElements}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageChange} />
                        }
                    </div>
                    {checkLogin ? <div className='mt-2 w-full flex gap-2 justify-between items-center'>
                        <SearchInput onSearch={handleSearch} />
                        <BoardWriteModal />
                    </div> : null}
                </div>
            </div>
        </div>
    );
};

export default BoardList;
