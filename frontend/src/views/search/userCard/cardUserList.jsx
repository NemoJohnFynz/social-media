import React, { useState, useCallback, useEffect } from 'react';
import userImg from '../../../img/user.png';
import friend from '../../../service/friend';
import { ToastContainer, toast } from 'react-toastify';
import NotificationCss from '../../../module/cssNotification/NotificationCss'
import { useContext } from 'react';
import { useUser } from '../../../service/UserContext';
import Loading from '../../../components/Loading';
const CardUserList = ({ userdata: initialUserData }) => {
    const { userContext } = useUser();
    const [userdata, setUserdata] = useState(initialUserData);
    const [seding, setSending] = useState(true)
    // WebSocket message handler


    // Add friend functionality
    const handAddFriend = useCallback(async (id) => {
        setSending(false)
        try {
            const rs = await friend.AddFriend(id);
            console.log(rs.message);
            //friendrequest
            if (rs.success) {
                setUserdata((prev) => ({ ...prev, status: 'waiting' }));
                toast.success(rs?.message || 'Đã gửi yêu cầu kết bạn', NotificationCss.Success);
            } else {
                toast.error(rs?.message || 'Gửi yêu cầu kết bạn thất bại', NotificationCss.Fail);
            }
        } catch (error) {
            console.error(error);
        }
        setSending(true)
    }, []); // Add empty array to ensure it's only created once
    const handCloseFriend = async (id) => {
        setSending(false)
        try {
            const rs = await friend.cancelFriend(id);
            if (rs.success) {
                setUserdata((prev) => ({ ...prev, status: 'no friend' }));
                toast.success(rs?.message || 'Đã hủy kết bạn', NotificationCss.Success);
            } else {
                toast.error(rs?.message || 'Lỗi khi hủy kết bạn', NotificationCss.Fail);
            }
        } catch (error) {
            console.error(error);
        }
        setSending(true)
    };

    const handCancelRequest = async (id) => {
        setSending(false)
        try {
            const rs = await friend.cancelFriendRequest(id);
            if (rs) {
                setUserdata((prev) => ({ ...prev, status: 'no friend' }));
                toast.success(rs?.message || 'Đã hủy yêu cầu kết bạn', NotificationCss.Success);
            } else {
                toast.error(rs?.message || 'Lỗi khi hủy yêu cầu kết bạn', NotificationCss.Fail);
            }
        } catch (error) {
            console.error(error);
        }
        setSending(true)
    };

    const handDetailUser = (id) => {
        window.location.href = `/user/${id}`;
    };

    return (
        <>
            <button
                onClick={() => handDetailUser(userdata._id)}
                className="w-full flex flex-row rounded-lg hover:bg-gray-100 justify-between items-center p-2 max-h-[80px] sm:max-h-[60px] md:max-h-[70px] lg:max-h-[80px]"
            >
                <div className="flex flex-row items-center">
                    <div>
                        <img
                            className="w-14 h-14 rounded-full"
                            src={userdata.avatar || userImg}
                            alt=''
                        />
                    </div>
                    <div className="flex flex-col pl-2">
                        <div className="text-start font-semibold text-nowrap overflow-hidden text-ellipsis max-w-52">
                            {userdata.firstName || ''} {userdata.lastName || ''}
                        </div>
                        <div>number post</div>
                        {/* Bạn chung */}
                    </div>
                </div>
                <div className="py-5">
                    {
                        seding == true ?
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (userdata._id && userdata.status) {
                                        switch (userdata.status) {
                                            case 'no friend':
                                                handAddFriend(userdata._id);
                                                break;
                                            case 'friend':
                                                handCloseFriend(userdata._id);
                                                break;
                                            default:
                                                handCancelRequest(userdata._id);
                                                break;
                                        }
                                    }
                                }}
                                className={`rounded-xl p-2 min-w-24 shadow-sm shadow-gray-300 ${userdata.status === 'friend'
                                    ? 'hover:text-red-600 text-red-500 hover:bg-red-200 bg-red-100'
                                    : 'hover:text-blue-600 text-blue-500 hover:bg-blue-200 bg-blue-100'
                                    }`}
                            >
                                <strong className="text-sm">
                                    {userdata.status === 'no friend'
                                        ? 'Add Friend'
                                        : userdata.status === 'friend'
                                            ? 'Cancel Friend'
                                            : 'Cancel Request'}
                                </strong>
                            </button>

                            :
                            <Loading />

                    }

                </div>
            </button>

        </>
    );
};

export default CardUserList;
