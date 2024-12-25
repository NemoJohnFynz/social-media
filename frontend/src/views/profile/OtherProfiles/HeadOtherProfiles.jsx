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
                if (result?.success) {
                    setFriendStatus(result.data.status);
                } else {
                    setFriendStatus("no friend");
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
    const handRemoveFriend = async (id) => {
        try {
            const rs = await friend.cancelFriend(id);
            if (rs.success) {
                toast.success(rs?.message ? rs.message : 'Đã hủy kết bạn', NotificationCss.Success);
                setFriendStatus("pending");
            } else {
                toast.error(rs?.message ? rs.message : 'hủy kết bạn thất bại', NotificationCss.Fail);
            }
            console.log(rs);
        } catch (error) {
            console.error(error);
        }
    };
    const handCancelRequest = async (id) => {
        try {
            const rs = await friend.cancelFriendRequest(id);
            if (rs.success) {
                setFriendStatus("no friend");
                toast.success(rs?.message || 'Đã hủy yêu cầu kết bạn', NotificationCss.Success);
            } else {
                toast.error(rs?.message || 'Lỗi khi hủy yêu cầu kết bạn', NotificationCss.Fail);
            }
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
                >

                </div>
                <div className="">
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                        <img
                            className="rounded-full h-40 w-40 items-center border-4"
                            alt=""
                            src={`${dataProfile && dataProfile.avatar
                                ? dataProfile.avatar
                                : 'https://th.bing.com/th/id/OIP.PKlD9uuBX0m4S8cViqXZHAHaHa?rs=1&pid=ImgDetMain'
                                }`}
                        />
                    </div>
                    <div className='h-24'></div>
                    <h1 className="font-bold text-2xl text-center mb-4">
                        {dataProfile?.lastName} {dataProfile?.firstName}
                    </h1>
                    <div className="flex gap-2 justify-center mb-5">
                        {friendStatus === "friend" ? (
                            <button
                                onClick={() => dataProfile ? handRemoveFriend(dataProfile._id) : ''}
                                className="bg-red-600 text-white p-2 rounded-full flex items-center gap-1"
                            >
                                <UserMinusIcon className="size-5 fill-white" />
                                Xóa bạn bè
                            </button>
                        ) : friendStatus === "waiting" ? (
                            <button
                                onClick={() => dataProfile ? handCancelRequest(dataProfile._id) : ''}
                                className="bg-sky-600 text-white p-2 rounded-full flex items-center gap-1"
                            >
                                <UserMinusIcon className="size-5 fill-white" />
                                hủy lời mời
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
                        <button
                            onClick={() => {
                                window.location.href = `/messenger/inbox/?iduser=${dataProfile._id}`;
                            }}

                            className="bg-green-600 text-white p-2 rounded-full flex items-center gap-1">
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
        </>

    );
}
