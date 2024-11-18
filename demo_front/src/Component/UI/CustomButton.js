import React from 'react'

const CustomButton = ({ label, onClick, px = 3, py = 2, mb = 2, ml, mr, mt, c }) => {
  const colors = {
    blue: "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300",
    red: "bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300"
  }
  return (
    <button type="button"
      className={`text-white 
      ${colors[c] || colors.blue}font-medium rounded-lg text-sm px-${px} py-${py} mb-${mb} mt-${mt} mr-${mr} ml-${ml}`}
      onClick={onClick}>{label}</button>
  )
}

export default CustomButton
