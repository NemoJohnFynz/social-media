import React from 'react'
import { Outlet } from 'react-router-dom'

import HeadProfile from '../components/HeadProfile'
import MenuProfile from '../components/MenuProfile'


export default function Personal() {

    return (
        <div className='flex place-content-center '>
            <div className='w-full  max-w-screen-xl'>

                <HeadProfile />
                <MenuProfile />
                <div className='flex place-content-center'>
                    <div className='w-full  max-w-[800px]'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
