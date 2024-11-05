import React from 'react'

const CustomButton = ({ label, onClick, px = 3, py = 2, mb = 2}) => {
  return (
    <button type="button"
      className={`text-white 
    bg-blue-700 
    hover:bg-blue-800 focus:ring-4 
    focus:ring-blue-300 font-medium rounded-lg text-sm px-${px} py-${py} mb-${mb}`}
      onClick={onClick}>{label}</button>
  )
}

export default CustomButton
