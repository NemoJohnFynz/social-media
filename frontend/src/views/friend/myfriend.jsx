import React from 'react'

import { Outlet } from 'react-router-dom'
// import MenuFriends from './MenuFriends'

export default function Myfriend() {
    return (
        // <div className='flex justify-center '>
        //     <div className=' mt-4  w-full max-w-[1000px]'>
        //         <MenuFriends />
        //         <div className='p-3'>
        //             <Outlet />
        //         </div>
        //     </div>
        // </div>
        <div className="flex row ">
            <div className="flex flex-col shadow-md shadow-slate-500 w-1/5 min-h-screen fixed items-center px-4 ">
                <div className="w-full border-b border-b-gray-400 py-4 text-2xl">
                    <strong>Bạn bè</strong>
                </div>
                <div className="flex flex-col w-full pt-3">
                    <a href='/friends'>
                        <button className="w-full p-3 pl-5 rounded-2xl text-start hover:bg-blue-100 ">
                            <strong >Trang chủ</strong>
                        </button>
                    </a>
                    <a href='/friends/requests'>
                        <button className="w-full p-3 pl-5 rounded-2xl text-start hover:bg-blue-100">
                            <strong>Lời mời kết bạn</strong>
                        </button>
                    </a>
                    <a href='/friends/list'>
                        <button className="w-full p-3 pl-5 rounded-2xl text-start hover:bg-blue-100">
                            <strong>Bạn bè</strong>
                        </button>
                    </a>

                </div>
            </div>
            <div className="ml-[20%] w-[80%] pt-2">
                <Outlet />
            </div>
        </div>
    )
}