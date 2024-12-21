import React from 'react'
import { Link } from 'react-router-dom'
import user from '../../../service/user';
import { useEffect, useState } from 'react';
import imgUser from '../../../img/user.png'
import friend from '../../../service/friend';
import DropdownMyfriend from '../DropdownMyfriend'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

import {
    HeartIcon,
    ChatBubbleOvalLeftIcon,
    NoSymbolIcon,
    UserMinusIcon
} from '@heroicons/react/16/solid'
import Loading from '../../../components/Loading';
export default function FriendCard({ iduser, idrequest }) {
    const [userdata, setUserdata] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    useEffect(() => {
        const fetchdata = async () => {

            try {
                const res = await user.getProfileUser(iduser);
                if (res.success) {
                    setUserdata(res.data)
                    console.log(res.data)
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchdata();
    }, [iduser]);
    if (loading) {
        return (
           <Loading/>
        )
    }
    const handDetailUser = async (id) => {
        window.location.href = `/user/${id}`;
    };
    const chaneUrl = async (url) => {
        window.location.href = String(url);
    };

    return (
        <div className="border border-gray-300 shadow-2xl max-w-52 rounded-lg m-2">

            <Link onClick={() => handDetailUser(userdata?._id)}>
                <img
                    className={`${userdata?.avatar ? '' : ' p-3'} w-full aspect-square rounded-t-lg  bg-gray-400`}
                    src={
                        userdata?.avatar
                            ? userdata.avatar
                            : imgUser
                    }
                    alt="User Avatar"
                />
            </Link>

            <div className="p-2 text-center">
                <strong>
                    {userdata
                        ? `${userdata.lastName || ''} ${userdata.firstName || ''}`.trim()
                        : "No Name"}
                </strong>
            </div>

            <div className="flex flex-row gap-2 px-2 mb-2">
                <button
                    onClick={userdata?._id ? () => chaneUrl(`/messenger/?iduser=${userdata._id}`) : undefined}
                    className="w-full bg-gray-300 py-2 text-black rounded-lg transition-transform transform hover:scale-105"
                >
                    Nhắn tin
                </button>
                <div className='flex justify-center items-center'>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="p-2 hover:bg-gray-300 rounded-full">
                            <ChevronDownIcon className="size-4 fill-gray-500" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content  menu bg-base-100  rounded-box z-[1] w-52 p-2 shadow-md shadow-gray-500">
                            <li>
                                <Link className="  data-[focus]:bg-[#3f3f46] p-2 rounded-md flex items-center gap-2" to="#">
                                    <HeartIcon className="size-5 fill-red-600" />
                                    Yêu thích
                                </Link>
                            </li>
                            <li>
                                <Link
                                 onClick={userdata?._id ? () => chaneUrl(`/messenger/?iduser=${userdata._id}`) : undefined}
                                className="  data-[focus]:bg-[#3f3f46] p-2 rounded-md flex items-center gap-2" to="#">
                                    <ChatBubbleOvalLeftIcon className="size-5 fill-blue-300" />
                                    Nhắn tin
                                </Link>
                            </li>
                            <li>
                                <Link className="  data-[focus]:bg-[#3f3f46] p-2 rounded-md flex items-center gap-2" to="#">
                                    <NoSymbolIcon className="size-5 fill-red-800" />
                                    Chặn
                                </Link>
                            </li>
                            <li>
                                <Link className=" data-[focus]:bg-[#3f3f46] p-2 rounded-md flex items-center gap-2" to="#">
                                    <UserMinusIcon className="size-5 fill-red-500" />
                                    Hủy kết bạn
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>

    )
}
