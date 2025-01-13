import React, { useRef } from 'react';

const SearchInput = ({
    options = [{ title: "제목", content: "내용", nickname: "닉네임" }],
    placeholder = "검색어 입력",
    onSearch }) => {

    const typeRef = useRef('');
    const inputRef = useRef('');

    const handleSearch = () => {
        if (onSearch) {
            onSearch(typeRef.current.value, inputRef.current.value);
        }
    }

    return (
        <div className="w-full max-w-sm min-w-[200px] -mt-1">
            <div className="relative bg-white rounded-md">
                <div className="absolute top-2 left-2 flex items-center">
                    <select ref={typeRef}>
                        {options.map(item =>
                            Object.entries(item).map(([key, value]) => (
                                <option
                                    key={key}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm cursor-pointer"
                                    value={key}>
                                    {value}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <input
                    type="text"
                    ref={inputRef}
                    maxLength={100}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md 
                    px-24 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder={placeholder}
                   />
                <button
                    className="absolute top-1 right-1 flex items-center rounded bg-slate-800 
                    py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow 
                    focus:bg-slate-700 focus:shadow-none active:bg-slate-700 
                    hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={handleSearch}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1.5">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                    검색
                </button>
            </div>
        </div>
    )
}

export default SearchInput
