import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/16/solid';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import imgUser from '../../../img/user.png';
import user from '../../../service/user';
import messenger from '../../../service/messenger';
import { useUser } from '../../../service/UserContext';
import { format } from 'date-fns';
import useWebSocket from './usewebsocket';
import Loading from '../../../components/Loading';

const MessengerInbox = () => {
    const { userContext } = useUser();
    const location = useLocation();

    const [textareaHeight, setTextareaHeight] = useState(40);
    const [iduser, setIdUser] = useState(null);
    const [userdata, setUserdata] = useState({});
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false); // Added sending state
    const [message, setMessage] = useState('');
    const [messengerdata, setMessengerdata] = useState([]);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messengerdata]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get('iduser');
        setIdUser(userId);
    }, [location.search]);

    useEffect(() => {
        if (!iduser || iduser === '') {
            setError('User ID is missing or invalid.');
            setLoading(false);
            return;
        }
        const fetchUserData = async () => {
            try {
                const res = await user.getProfileUser(iduser);
                if (res.success) {
                    setUserdata(res.data);
                } else {
                    setError('User does not exist.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('An error occurred while fetching user data.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [iduser]);

    useEffect(() => {
        if (iduser === '' || !iduser) return;
        const fetchMessengerData = async () => {
            try {
                const res = await messenger.getListMessengerByUser(iduser);
                if (res.success) {
                    setMessengerdata(res.data);
                }
            } catch (error) {
                console.error('Error fetching messenger data:', error);
            }
        };
        fetchMessengerData();
    }, [iduser]);

    const onMessageReceived = useCallback(
        (newMessage) => {
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

    const handleInputChange = useCallback((e) => {
        const textarea = e.target;
        const currentValue = textarea.value;

        setMessage(currentValue);

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        setTextareaHeight(textarea.scrollHeight);
    }, []);

    const handleSendMessenger = useCallback(async () => {
        if (!message.trim() || sending) return; // Prevent sending if already in progress

        setSending(true); // Set sending state
        try {
            const res = await messenger.sendMess(iduser, message.trim());
            if (res.success) {
                setMessage('');
                setTextareaHeight(40);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false); // Reset sending state
        }
    }, [iduser, message, sending]);

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
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    const groupedMessages = messengerdata.reduce((acc, message) => {
        const createdAtDate = new Date(message.createdAt);
        if (isNaN(createdAtDate)) {
            console.error('Invalid date value:', message.createdAt);
            return acc;
        }

        const date = format(createdAtDate, 'yyyy-MM-dd');
        if (!acc[date]) acc[date] = [];
        acc[date].push(message);
        return acc;
    }, {});
    console.log(groupedMessages)
    return (
        <div className="flex flex-col h-full w-full">
            <div className="p-2 flex items-center border-b h-14 bg-white shadow-sm">
                <button onClick={() => window.location.href = `/user/${userdata?._id}`}>
                    <img
                        className="w-10 h-10 rounded-full mr-2"
                        src={userdata?.avatar || imgUser}
                        alt="User Avatar"
                    />
                </button>
                <h3 className="font-semibold">{`${userdata.lastName || ''} ${userdata.firstName || ''}`.trim()}</h3>
            </div>

            <div className="overflow-y-scroll h-full p-4 pt-2 flex flex-col">
                {Object.keys(groupedMessages).map((date) => (
                    <div key={date} className="mb-4">
                        <div className="text-center text-gray-500 text-sm my-2">
                            {format(new Date(date), 'MMMM dd, yyyy')}
                        </div>
                        {groupedMessages[date].map((mess, index) => (
                            <div
                                key={`${mess._id}-${index}`}
                                className={clsx(
                                    'rounded-lg shadow-sm p-2 border min-h-11 my-4',
                                    mess?.author?._id == mess?.receiver
                                        ? 'bg-blue-100 ml-24 border-blue-500'
                                        : mess.receiver === userContext._id
                                            ? 'bg-white mr-24 border-gray-300'
                                            : 'bg-blue-100 ml-24 border-blue-500'
                                )}
                            >
                                <p className="text-black">{mess.content}</p>
                                <p className="text-xs text-gray-400 text-left mt-2">
                                    {format(new Date(mess.createdAt), 'hh:mm a')}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="w-full flex p-2 border-gray-200 border-t-2">
                <textarea
                    className="rounded-lg border p-2 w-full resize-none text-sm  shadow-inner shadow-gray-400 focus:outline-none"
                    rows={1}
                    style={{ height: `${textareaHeight}px`, maxHeight: '4rem', minHeight: '40px' }}
                    placeholder="Nhập @, tin nhắn"
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSendMessenger} className="ml-2" disabled={sending}>
                    <PaperAirplaneIcon className="h-8 w-8 fill-sky-500" />
                </button>
            </div>
        </div>
    );
};

export default MessengerInbox;