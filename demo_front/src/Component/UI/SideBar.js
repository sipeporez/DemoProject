import React from 'react'

const SideBar = () => {
  return (
    <aside
      className="flex-col justify-center items-center fixed -mt-16 z-10 min-h-full hidden
      lg:w-32 lg:flex lg:visible
      xl:w-48 xl:flex
      transition-all duration-300 bg-zinc-400">
      <div>여기에 이미지</div>
      <div>여기에 글</div>
    </aside>
  )
}

export default SideBar
