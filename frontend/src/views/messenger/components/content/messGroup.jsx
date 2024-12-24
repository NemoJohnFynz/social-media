import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/16/solid';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import imgUser from '../../../../img/user.png';
import user from '../../../../service/user';
import messenger from '../../../../service/messenger';
import { useUser } from '../../../../service/UserContext';
import { format } from 'date-fns';
import useWebSocket from '../../../../service/webSocket/usewebsocket';
import Loading from '../../../../components/Loading';
import { Box, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon, ChevronLeftIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useContext } from "react";
import { MessengerContext } from '../../layoutMessenger';
import { toast, ToastContainer } from 'react-toastify';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import NotificationCss from '../../../../module/cssNotification/NotificationCss';
import group from '../../../../service/group';
const MessengerInbox = () => {
    const { userContext } = useUser();
    const { RightShow, handleHiddenRight, setContent, setInboxData } = useContext(MessengerContext);
    const location = useLocation();
    const [textareaHeight, setTextareaHeight] = useState(40);
    const [iduser, setIdUser] = useState(null);
    // const [userdata, setUserdata] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingHeader, setLoadingHeader] = useState(true);
    const [loadingMess, setLoadingMess] = useState(true);
    const [sending, setSending] = useState(false); // Added sending state
    const [message, setMessage] = useState('');
    const [messengerdata, setMessengerdata] = useState([]);
    const [dataGroup, setDataGroup] = useState([]);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);



    //file
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [openModal, setOpenModal] = useState(false); // Trạng thái modal
    const [modalImage, setModalImage] = useState(null); // Ảnh phóng to

    const [openDialog, setOpenDialog] = useState(false); // For controlling the confirmation dialog
    const [messageToRevoke, setMessageToRevoke] = useState(null); // Store message to be revoked

    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        setIdUser(queryParams.get('idgroup'));

    }, [location]);
    const handleRevokedClick = async (messageId) => {
        setMessageToRevoke(messageId); // Store the message ID to revoke
        setOpenDialog(true); // Open the confirmation dialog
    };

    const confirmRevokeMessage = async () => {
        if (!messageToRevoke) return; // Ensure there's a valid message to revoke
        try {
            const res = await messenger.revokedMesage(messageToRevoke); // API call to revoke the message
            if (res.success) {
                setMessengerdata((prevMessages) =>
                    prevMessages.filter((message) => message._id !== messageToRevoke)
                );
                toast.success(res?.message || 'Bạn vừa thu hồi tin nhắn thành công', NotificationCss.Success);
            } else {
                console.error("Failed to revoke message:", res);
                toast.error(res?.message || 'Lỗi khi thu hồi tin nhắn', NotificationCss.Fail);
            }
        } catch (error) {
            console.error("Error revoking message:", error);
        } finally {
            setOpenDialog(false); // Close the dialog
            setMessageToRevoke(null); // Clear the message ID
        }
    };

    const cancelRevokeMessage = () => {
        setOpenDialog(false); // Close the dialog
        setMessageToRevoke(null); // Clear the message ID
    };
    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' }); // Cuộn đến tin nhắn cuối
        }
    }, []);

    useEffect(() => {
        scrollToBottom(); // Tự động cuộn mỗi khi dữ liệu tin nhắn thay đổi
    }, [messengerdata, scrollToBottom]);



    // useEffect(() => {
    //     if (!iduser || iduser === '') {
    //         setError('User ID is missing or invalid.');
    //         setLoading(false);
    //         return;
    //     }
    //     const fetchUserData = async () => {
    //         try {
    //             const res = await user.getProfileUser(iduser);
    //             if (res.success) {
    //                 setUserdata(res.data);
    //             } else {
    //                 setError('User does not exist.');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //             setError('An error occurred while fetching user data.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchUserData();

    // }, [iduser]);
    //file
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Tạo URL preview cho ảnh
        }
    };
    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
    };
    const handleOpenModal = (img) => {
        if (!img) {
            setModalImage(preview); // Đặt ảnh vào modal
        } else {
            setModalImage(img);
        }
        setOpenModal(true); // Mở modal
    };

    const handleCloseModal = () => {
        setOpenModal(false); // Đóng modal
    };

    useEffect(() => {
        if (iduser === '' || !iduser) return;
        const fetchMessengerData = async () => {
            try {
                const res = await group.getMessengerGroup(iduser);
                if (res.success) {
                    setMessengerdata(res.data.messages);
                    setDataGroup(res.data)
                    // console.log(res.data.messages)
                }
            } catch (error) {
                console.error('Error fetching messenger data:', error);
            }
        };
        fetchMessengerData();
        setContent('group');
        setLoading(false);
        setLoadingMess(false)
    }, [iduser]);

    const onMessageReceived = useCallback(
        (newMessage) => {
            console.log("Received message:", newMessage);
            if (!newMessage.receiver) {
                newMessage.receiver = userContext._id;
            }
            if (!newMessage.createdAt) {
                newMessage.createdAt = new Date().toISOString();
            }

            if (newMessage.receiver === userContext._id && newMessage.sender !== userContext._id) {
                setMessengerdata((prevMessages) => [...prevMessages, newMessage]);
            }
        },
        [userContext._id]
    );
    useWebSocket(onMessageReceived);

    useEffect(() => {

        // Kiểm tra và xử lý điều kiện bên trong hook
        if (!messengerdata || Object.keys(messengerdata).length === 0) {
            return; // Không làm gì nếu `groupedMessages` không hợp lệ
        }

        // Cập nhật dữ liệu nếu `groupedMessages` tồn tại
        const inboxUpdate = {
            data: dataGroup,
            messenger: messengerdata,
        };
        setLoadingHeader(false)
        setInboxData(inboxUpdate);
    }, [messengerdata, dataGroup, setInboxData]);



    const handleInputChange = useCallback((e) => {
        const textarea = e.target;
        const currentValue = textarea.value;

        setMessage(currentValue);

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        setTextareaHeight(textarea.scrollHeight);
    }, []);

    const handleSendMessenger = useCallback(async () => {

        if (!message.trim() && !file || sending) return; // Prevent sending if already in progress
        console.log('aaa')
        setSending(true); // Set sending state
        try {
            const res = await group.sendMessGroup(iduser, message.trim(), file);

            if (res.success) {
                setMessage('');
                setFile(null);
                setPreview(null);
                setTextareaHeight(40);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false); // Reset sending state
        }
    }, [iduser, message, sending, file]);
    const handleRevokedMessenger = async (id) => {
        try {
            const res = await messenger.revokedMesage(id);

        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
    // revokedMesage
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessenger();
            }
        },
        [handleSendMessenger]
    );

    if (loading) {
        return <Loading />;
    }
    if (!iduser) {
        return <div className="text-red-500 text-center mt-4"></div>;//{error}
    }

    const groupedMessages = messengerdata.reduce((acc, message) => {
        try {
            const createdAtDate = new Date(message.createdAt);
            if (isNaN(createdAtDate)) {
                console.warn('Invalid date:', message.createdAt);

                return acc; // Skip invalid dates
            }

            const dateKey = format(createdAtDate, 'yyyy-MM-dd');
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(message);
        } catch (error) {
            console.error('Error grouping message:', error);
        }
        return acc;
    }, {});

    console.log(dataGroup)
    return (
        <div className="flex flex-col h-full ">
            <div className="p-2 flex border-b h-14 bg-white shadow-sm">
                {
                    loadingHeader ?
                        <div className='w-full flex flex-row items-center'>
                            <Loading />
                        </div> :
                        <div className='w-full flex flex-row items-center'>
                            <button >
                                {/* onClick={() => window.location.href = `/user/${userdata?._id}`} */}
                                <img
                                    className="w-10 h-10 rounded-full mr-2"
                                    src={dataGroup?.group?.avatarGroup[0] || imgUser}
                                    alt="User Avatar"
                                />
                            </button>
                            <h3 className="font-semibold text-nowrap">{`${dataGroup?.group?.name ? dataGroup.group.name : 'Group No Name'}`}</h3>
                        </div>

                }

                <div className=" flex justify-end">
                    <button onClick={handleHiddenRight} >
                        {
                            RightShow ? <ChevronRightIcon className="h-8 w-8 text-gray-700" />
                                :
                                <ChevronLeftIcon className="h-8 w-8 text-gray-700" />
                        }
                    </button>
                </div>
            </div>

            <div className="overflow-y-scroll h-full p-4 pt-1 bg-gray-100">
                {
                    loadingMess == true ?
                        <span className="loading loading-spinner loading-lg">Đang tải tin nhắn</span>
                        :
                        Object.entries(groupedMessages).map(([date, messages]) => (
                            <div key={date} className="mb-4">
                                <div className="text-center text-gray-500 text-sm my-2">
                                    {format(new Date(date), 'MMMM dd, yyyy')}
                                </div>
                                {messages.map((message, index) => (
                                    <div
                                        // ref={
                                        //     index === messages.length - 1
                                        //         ? messagesEndRef
                                        //         : null
                                        // }
                                        key={message?._id}
                                        className={`flex ${message?.sender?._id === userContext._id ? 'justify-end' : ''} `}

                                        onMouseEnter={() => {
                                            if (message?.sender?._id === userContext._id) {
                                                setHoveredMessageId(message._id);
                                            }
                                        }} // Set the hovered message
                                        onMouseLeave={() => setHoveredMessageId(null)} // Clear the hovered message
                                    >
                                        {
                                            hoveredMessageId === message?._id && message?.sender?._id === userContext._id ?
                                                <div>
                                                    <div className='h-full justify-center flex p-2 items-center'>
                                                        <button onClick={() => handleRevokedClick(message._id)}>
                                                            <ArrowUturnLeftIcon className="h-6 w-7 text-gray-500 bg-gray-100 rounded-sm " />
                                                        </button>
                                                    </div>
                                                </div>
                                                : ''
                                        }
                                        {
                                            message?.sender?._id !== userContext._id ?
                                                <div className='h-full pt-2'>
                                                    <button onClick={() => window.location.href = `/user/${message?.sender?._id}`}>
                                                        <img
                                                            className="w-10 h-10 rounded-full mr-2"
                                                            src={message?.sender?.avatar || imgUser}
                                                            alt="User Avatar"
                                                        />
                                                    </button>
                                                </div>
                                                : ''
                                        }


                                        <div

                                            className={clsx(
                                                'rounded-lg shadow-md p-2 my-2 min-w-28',
                                                message?.sender?._id === userContext._id ? 'bg-blue-100' : 'bg-white'
                                            )}
                                        >

                                            {message?.sender?._id !== userContext._id ?
                                                <p className="text-xs text-gray-400 mb-2">
                                                    {message?.sender?.lastName}
                                                    {message?.sender?.firstName}
                                                </p>
                                                : ''}
                                            {message?.mediaURL?.length > 0 && message.mediaURL.map((url, idx) => {
                                                const isVideo = url.endsWith(".mp4"); // Check if the URL ends with '.mp4'
                                                return isVideo ? (
                                                    <video
                                                        key={idx}
                                                        controls
                                                        className="max-w-full max-h-72 rounded-t-lg"
                                                    >
                                                        <source src={url} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : (
                                                    <img
                                                        key={idx}
                                                        src={url}
                                                        alt="Media"
                                                        className="max-w-full max-h-72 object-cover rounded-t-lg"
                                                        onClick={() => handleOpenModal(url)}
                                                    />
                                                );
                                            })}
                                            {
                                                message?.mediaURL === null ? (
                                                    <p className={`pb-2 ${message?.content ? 'text-black' : 'text-gray-400'}`}>
                                                        {message?.content ? message.content : 'Tin nhắn đã được thu hồi'}
                                                    </p>
                                                ) : (
                                                    <p className="pb-2 text-black">
                                                        {message?.content || ''}
                                                    </p>
                                                )
                                            }
                                            <p className="text-xs text-gray-400">
                                                {format(new Date(message?.createdAt), 'hh:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        ))
                }
                <div ref={messagesEndRef}></div>
            </div>




            <div className="w-full flex p-2 border-t-2 border-gray-200 bottom-0 flex-col">

                <div className='w-full'>
                    {
                        preview &&
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    maxWidth: '200px',
                                    maxHeight: '60px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                }}
                                onClick={() => handleOpenModal('')} // Mở modal khi click vào ảnh
                            />
                            {/* Nút xóa file */}
                            <IconButton
                                onClick={handleRemoveFile}
                                sx={{
                                    position: 'absolute',
                                    top: 1,
                                    right: 1,
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                                }}
                            >
                                <CloseIcon color="error" />
                            </IconButton>
                        </Box>
                    }
                </div>
                {sending ? (
                    <div className='flex items-center gap-2 justify-center text-blue-500 text-xl uppercase'>
                        <span className="loading loading-spinner loading-md"></span>
                        <strong>Đang gửi tin nhắn <span className="dots">...</span></strong>
                    </div>
                ) :
                    <>
                        <div className='flex items-center w-full'>
                            <label htmlFor="file-input" className='mr-1'>
                                <IconButton component="span">
                                    <PhotoIcon className="size-7 fill-sky-600" />
                                </IconButton>
                            </label>
                            <input
                                type="file"
                                id="file-input"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*" // Chỉ nhận file ảnh
                            />
                            <textarea
                                className="rounded-lg border p-2 w-full resize-none text-sm  shadow-inner shadow-gray-400 focus:outline-none"
                                rows={1}
                                style={{ height: `${textareaHeight}px`, maxHeight: '5rem', minHeight: '40px' }}
                                placeholder="Nhập @, tin nhắn"
                                value={message}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                            />
                            <button onClick={handleSendMessenger} className="ml-2" disabled={sending}>
                                <PaperAirplaneIcon className="h-8 w-8 fill-sky-500" />
                            </button>

                        </div>

                    </>
                }
                {/* Modal phóng to ảnh */}
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <Box sx={{ position: 'relative', backgroundColor: 'black', padding: 0.4, borderRadius: 2 }}>
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                            }}
                        >
                            <CloseIcon color="error" />
                        </IconButton>
                        {modalImage && (
                            modalImage.endsWith(".mp4") ? (
                                <video
                                    controls
                                    className="w-full h-full object-contain rounded"
                                    style={{
                                        maxWidth: '90vw',
                                        maxHeight: '90vh',
                                    }}
                                >
                                    <source src={modalImage} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    className=""
                                    src={modalImage}
                                    alt="Modal Preview"
                                    style={{
                                        maxWidth: '90vw',
                                        maxHeight: '90vh',
                                        borderRadius: '8px',
                                    }}
                                />
                            )
                        )}

                    </Box>
                </Modal>
                {/* Confirmation Dialog */}
                <Dialog open={openDialog} onClose={cancelRevokeMessage}>
                    <DialogTitle>Xác nhận thu hồi tin nhắn</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có chắc chắn muốn thu hồi tin nhắn này? Thao tác này không thể hoàn tác.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelRevokeMessage} color="secondary">
                            Hủy
                        </Button>
                        <Button onClick={confirmRevokeMessage} color="primary">
                            Thu hồi
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div >
    );
};

export default MessengerInbox;