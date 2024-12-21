import React, { useState, useEffect } from 'react';
import {
    UserPlusIcon,
    NoSymbolIcon,
    ChatBubbleLeftRightIcon,
    UserMinusIcon
} from '@heroicons/react/24/outline';
import friend from '../../../service/friend';
import { ToastContainer, toast } from 'react-toastify';
import NotificationCss from '../../../module/cssNotification/NotificationCss';

export default function HeadOtherProfiles({ dataProfile }) {
    const [friendStatus, setFriendStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriendStatus = async () => {
            if (dataProfile?._id) {
                setLoading(true);
                const result = await friend.checkFriend(dataProfile._id);
                if (result.success) {
                    setFriendStatus(result.status);
                } else {
                    setFriendStatus(null);
                }
                setLoading(false);
            }
        };

        fetchFriendStatus();
    }, [dataProfile]);

    const handAddFriend = async (id) => {
        try {
            const rs = await friend.AddFriend(id);
            if (rs.success) {
                toast.success(rs?.message ? rs.message : 'Đã gửi yêu cầu kết bạn', NotificationCss.Success);
                setFriendStatus("pending");
            } else {
                toast.error(rs?.message ? rs.message : 'gửi yêu cầu kết bạn thất bại', NotificationCss.Fail);
            }
            console.log(rs);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-sky-600 rounded-full"></div>
            </div>
        );
    }

    return (
        <>
            <div className="">
                <div
                    className="h-[300px] rounded-2xl z-0 grid bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `url(${dataProfile && dataProfile.coverImage
                            ? dataProfile.coverImage
                            : 'https://mcdn.wallpapersafari.com/medium/91/45/MehDBZ.jpg'
                            })`,
                        backgroundPosition: '10%',
                    }}
                ></div>
                <div className="grid justify-items-center relative z-0 bottom-20 overflow-hidden gap-4">
                    <img
                        className="rounded-full h-40 w-40 items-center"
                        alt=""
                        src={`${dataProfile && dataProfile.avatar
                            ? dataProfile.avatar
                            : 'https://th.bing.com/th/id/OIP.PKlD9uuBX0m4S8cViqXZHAHaHa?rs=1&pid=ImgDetMain'
                            }`}
                    />
                    <h1 className="font-bold text-2xl text-center">
                        {dataProfile?.lastName} {dataProfile?.firstName}
                    </h1>
                    <div className="flex gap-2">
                        {friendStatus === "friend" ? (
                            <button
                                onClick={() => dataProfile ? handAddFriend(dataProfile._id) : ''}
                                className="bg-red-600 text-white p-2 rounded-full flex items-center gap-1"
                            >
                                <UserMinusIcon className="size-5 fill-white" />
                                Xóa bạn bè
                            </button>
                        ) : (
                            <button
                                onClick={() => dataProfile ? handAddFriend(dataProfile._id) : ''}
                                className="bg-sky-600 text-white p-2 rounded-full flex items-center gap-1"
                            >
                                <UserPlusIcon className="size-5 fill-white" />
                                Kết bạn
                            </button>
                        )}
                        <button className="bg-green-600 text-white p-2 rounded-full flex items-center gap-1">
                            <ChatBubbleLeftRightIcon className="size-5" />
                            Nhắn tin
                        </button>
                        <button className="bg-red-600 text-white p-2 rounded-full flex items-center gap-1">
                            <NoSymbolIcon className="size-5" />
                            Chặn
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer  style={{ marginTop: '55px' }}/>
        </>

    );
}
