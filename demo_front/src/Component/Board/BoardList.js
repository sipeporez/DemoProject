import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react';
import { CustomAxios } from '../CustomAxios';
import BoardWriteModal from '../Form/BoardWriteModal';
import BoardView from './BoardView';
import NavBar from '../UI/NavBar';

const columns = [
    { id: 'title', label: '제목', minWidth: 170 },
    { id: 'nickname', label: '닉네임', minWidth: 170, align: 'center' },
    { id: 'writtenDate', label: '작성일', minWidth: 170, align: 'center' },
    { id: 'likeCnt', label: '좋아요', minWidth: 100, align: 'center' },
];

const BoardList = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState({ number: 0, size: 5, totalElements: 0 });
    const [currentPage, setCurrentPage] = useState(page.number);
    const [boardIdx, setBoardIdx] = useState('');

    useEffect(() => {
        fetchData(currentPage, page.size);
    }, [currentPage, page.size]); // Fetch data on page or size change

    const fetchData = (currentPage, pageSize) => {
        CustomAxios({
            methodType: 'get',
            backendURL: `board/list?page=${currentPage}&size=${pageSize}`,
            onResponse: handleResponse,
        });
    };

    const handleResponse = (response) => {
        setData(response.content);
        setPage({
            ...page,
            totalElements: response.page.totalElements, // Update total elements
            number: response.page.number
        });
        setCurrentPage(response.page.number); // Ensure current page reflects response
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newSize = +event.target.value;
        setPage({ ...page, size: newSize, number: 0 }); // Reset to first page
        setCurrentPage(0); // Reset current page
    };

    const handleBoardIdx = (idx) => {
        setBoardIdx(idx)
        window.scrollTo(0, 0)
    }

    return (
        <>
            <header>
                <NavBar />
            </header>
            {boardIdx &&
                <BoardView boardIdx={boardIdx} />}
            <div className="flex justify-center w-full h-screen">
                <div className="w-1/2 max-w-screen-xl justify-center items-center">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align="center"
                                                size="small"
                                                style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.idx}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        onClick={() => handleBoardIdx(row.idx)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {column.id === 'title'
                                                            ? (value.length > 25 ? value.slice(0, 25) + '...' : value)
                                                            : column.id === 'writtenDate'
                                                                ? new Date(value).toLocaleString()
                                                                : value
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={page.totalElements} // Use total elements for count
                            rowsPerPage={page.size}
                            page={currentPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <div className='float-right mt-2'>
                        <BoardWriteModal />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BoardList;
