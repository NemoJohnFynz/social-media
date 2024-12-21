import userImg from '../../../img/user.png'
import friend from '../../../service/friend';
import { ToastContainer, toast } from 'react-toastify';
import NotificationCss from '../../../module/cssNotification/NotificationCss';
const CardUserList = ({ userdata }) => {
    const handAddFriend = async (id) => {
        try {
            const rs = await friend.AddFriend(id)
            if (rs.success) {
                toast.success(rs?.message ? rs.message : 'Đã gửi yêu cầu kết bạn', NotificationCss.Success);
            } else {
                toast.error(rs?.message ? rs.message : 'gửi yêu cầu kết bạn thất bại', NotificationCss.Fail);
            }
            // console.log(rs);
        } catch (error) {
            console.error(error);
        }
    };
    const handCloseFriend = async (id) => {
        try {
            const rs = await friend.cancelFriend(id)
            if (rs.success) {
                toast.success(rs?.message ? rs.message : 'Đã hủy kết bạn', NotificationCss.Fail);
            } else {
                toast.error(rs?.message ? rs.message : 'Lỗi khi hủy kết bạn', NotificationCss.Fail);
            }
            // console.log(rs);
        } catch (error) {
            console.error(error);
        }
    };
    const handDetailUser = async (id) => {
        window.location.href = `/user/${id}`;
    };
    return (
        <>
            <button
                onClick={() => { handDetailUser(userdata._id) }}
                className="w-full flex flex-row rounded-lg hover:bg-green-50 justify-between items-center p-2 max-h-[80px] sm:max-h-[60px] md:max-h-[70px] lg:max-h-[80px]">
                <div className="flex flex-row items-center">
                    <div >
                        <img className="w-14 h-14 rounded-full" src={userdata && userdata.avatar ? userdata.avatar : userImg} />
                    </div>
                    <div className="flex flex-col pl-2">
                        <div className='text-start'>{userdata ? (userdata.firstName ? userdata.firstName : '', userdata.lastName ? userdata.lastName : '') : 'No Name'}</div>
                        <div>number post</div>
                        {/* Friend chung */}
                    </div>
                </div>
                <div className="py-5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (userdata && userdata._id && userdata.status) {
                                switch (userdata.status) {
                                    case 'no friend':
                                        handAddFriend(userdata._id);
                                        break;
                                    case "friend":
                                        handCloseFriend(userdata._id);
                                        break;
                                    default:
                                    // code block
                                }
                            }
                        }}
                        className={` rounded-xl p-2 min-w-24 shadow-sm shadow-gray-300
                        ${userdata?.status == 'friend' ? 'hover:text-red-600 text-red-500 hover:bg-red-200 bg-red-100'
                                : 'hover:text-blue-600 text-blue-500 hover:bg-blue-200 bg-blue-100'}`}
                    >
                        <strong className='text-sm'>

                            {
                                userdata?._id && userdata?.status ? (
                                    userdata.status == 'no friend' ? 'Add Friend' :
                                        userdata.status == 'friend' ? 'Cancel Friend' : 'Cancel Request'
                                ) : ''
                            }
                        </strong>
                    </button>
                </div>

            </button>
             <ToastContainer  style={{ marginTop: '55px' }}/>
        </>
    );
}

export default CardUserList;