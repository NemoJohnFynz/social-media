import React from 'react'
import { useState, useEffect } from 'react'
import { profileUserCurrent } from '../../../service/ProfilePersonal'
import { PencilIcon } from '@heroicons/react/24/solid'
import ModalUpdateAVT from './ModalUpdateAVT'
export default function HeadProfile() {
    const [dataProfile, setDataProfile] = useState({})

    useEffect(() => {
        const fetchdata = async () => {
            const response = await profileUserCurrent();
            if (response && response.data) {
                setDataProfile(response.data)
            }
        }
        fetchdata()
    }, [])
    return (
        <div className=''>
            <div
                className=" h-[300px] rounded-2xl z-0 grid bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url(${dataProfile && dataProfile.coverImage ? dataProfile.coverImage : 'https://mcdn.wallpapersafari.com/medium/91/45/MehDBZ.jpg'})`,
                    backgroundPosition: '10%',
                }}>

            </div>
            <div className='flex justify-center relative z-0 bottom-20 overflow-hidden items-baseline gap-1'>
                <div>
                    <img className='rounded-full h-40 w-40 ' alt=''
                        src={`${dataProfile && dataProfile.avatar ? dataProfile.avatar : "https://th.bing.com/th/id/OIP.PKlD9uuBX0m4S8cViqXZHAHaHa?rs=1&pid=ImgDetMain"}`} />
                    <h1 className='font-bold text-2xl mt-3'>{dataProfile && dataProfile.lastName} {dataProfile && dataProfile.firstName}</h1>
                </div>
                <button className="" onClick={() => document.getElementById('my_modal_2').showModal()}><PencilIcon className='size-4 fill-sky-800' /></button>
                <ModalUpdateAVT user={dataProfile} />
            </div>
        </div >

    )
}
