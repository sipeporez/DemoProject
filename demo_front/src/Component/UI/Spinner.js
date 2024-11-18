import React from 'react'

// 코드 출처 : https://tw-elements.com/docs/standard/components/spinners/
const Spinner = ({ height = 4, width = 4, border = 2 }) => {
    return (
        <div className={`inline-block h-${height} w-${width} animate-spin 
        rounded-full border-${border} border-solid border-current
        border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"`}>
        </div>
    )
}

export default Spinner
