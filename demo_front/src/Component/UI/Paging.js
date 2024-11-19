import React from 'react';
import Pagination from 'react-js-pagination';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Paging = ({ activePage, itemsCountPerPage, totalItemsCount, pageRangeDisplayed, onPageChange, activeLinkClass='bg-gray-300 rounded' }) => {
    return (
        <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsCountPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={pageRangeDisplayed}
            onChange={onPageChange}
            prevPageText={<ChevronLeftIcon className='w-4 h-4 mt-1.5' />}
            nextPageText={<ChevronRightIcon className='w-4 h-4 mt-1.5' />}
            firstPageText={<ChevronDoubleLeftIcon className='w-4 h-4 mt-1.5' />}
            lastPageText={<ChevronDoubleRightIcon className='w-4 h-4 mt-1.5' />}
            itemClass="flex-1 align-middle justify-center items-center mx-2"
            activeLinkClass={activeLinkClass}
        />
    );
};

export default Paging;
