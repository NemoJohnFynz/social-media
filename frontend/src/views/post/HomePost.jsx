import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandThumbUpIcon, ChatBubbleLeftIcon, ShareIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import AVTUser from './AVTUser';
import { handleLike, handleDisLike, handleUnDisLike, handleUnLike, getHomeFeed } from '../../service/PostService';
import 'animate.css';
import { format, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import DropdownOtherPost from './components/DropdownOtherPost';
import DropdownPostPersonal from './components/DropdownPostPersonal';
import Loading from '../../components/Loading';
import { profileUserCurrent } from '../../service/ProfilePersonal';

import { useUser } from '../../service/UserContext';

export default function HomePost() {
    const [posts, setPosts] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState([]); // Tracks the posts currently displayed
    const [userLogin, setUserLogin] = useState({});
    const [loading, setLoading] = useState(true);
    const [postsToShow, setPostsToShow] = useState(10); // Controls the number of posts to display
    const [currentIndex, setCurrentIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [currentIndexes, setCurrentIndexes] = useState({});

    useEffect(() => {
        const fetchdata = async () => {
            setLoading(true);
            const response = await getHomeFeed();
            if (response) {
                const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPosts(sortedPosts);
                setDisplayedPosts(sortedPosts.slice(0, postsToShow)); // Display initial posts
                const responseUserPersonal = await profileUserCurrent();
                setUserLogin(responseUserPersonal.data);
            }
            setLoading(false);
        };
        setTimeout(fetchdata, 1000);
    }, []);

    useEffect(() => {
        setDisplayedPosts(posts.slice(0, postsToShow));
    }, [posts, postsToShow]);

    const loadMorePosts = () => {
        setPostsToShow((prev) => prev + 10); // Increment by 5
    };

    // Carousel Handlers
    const handlePrev = (post) => {
        setCurrentIndexes((prevIndexes) => ({
            ...prevIndexes,
            [post._id]: (prevIndexes[post._id] > 0 ? prevIndexes[post._id] : post.img.length) - 1
        }));
    };

    const handleNext = (post) => {
        setCurrentIndexes((prevIndexes) => ({
            ...prevIndexes,
            [post._id]: (prevIndexes[post._id] + 1) % post.img.length
        }));
    };

    //Like
    const handleLikeClick = async (postId) => {
        try {
            const post = posts.find(post => post._id === postId);
            if (post.likes.includes(userLogin._id)) {
                // Optimistically update the UI
                setPosts(posts.map(post =>
                    post._id === postId ? { ...post, likes: post.likes.filter(id => id !== userLogin._id) } : post
                ));
                await handleUnLike(postId);
            } else {
                // Optimistically update the UI
                setPosts(posts.map(post =>
                    post._id === postId ? { ...post, likes: [...post.likes, userLogin._id], dislikes: post.dislikes.filter(id => id !== userLogin._id) } : post
                ));
                await handleLike(postId);
                await handleUnDisLike(postId); // Undislike when liking
            }
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };
    //Dislike 
    const handleDislikeClick = async (postId) => {
        try {
            const post = posts.find(post => post._id === postId);
            if (post.dislikes.includes(userLogin._id)) {
                // Optimistically update the UI
                setPosts(posts.map(post =>
                    post._id === postId ? { ...post, dislikes: post.dislikes.filter(id => id !== userLogin._id) } : post
                ));
                await handleUnDisLike(postId);
            } else {
                // Optimistically update the UI
                setPosts(posts.map(post =>
                    post._id === postId ? { ...post, dislikes: [...post.dislikes, userLogin._id], likes: post.likes.filter(id => id !== userLogin._id) } : post
                ));
                await handleDisLike(postId);
                await handleUnLike(postId); // Unlike when disliking
            }
        } catch (error) {
            console.error("Error disliking the post:", error);
        }
    }
    // Time Format Function
    const formatDate = (date) => {
        const postDate = new Date(date);
        const currentDate = new Date();
        const minutesDifference = differenceInMinutes(currentDate, postDate);
        const hoursDifference = differenceInHours(currentDate, postDate);
        const daysDifference = differenceInDays(currentDate, postDate);

        if (minutesDifference < 60) {
            return `${minutesDifference} phút trước`;
        } else if (hoursDifference < 24) {
            return `${hoursDifference} giờ trước`;
        } else if (daysDifference <= 30) {
            return `${daysDifference} ngày trước`;
        } else {
            return format(postDate, 'dd/MM/yyyy HH:mm');
        }
    };
    //share
    const handleCopyLink = (postId) => {
        const link = `${window.location.href}post/${postId}`; // Lấy URL hiện tại
        navigator.clipboard
            .writeText(link)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset trạng thái sau 2 giây
            })
            .catch((err) => {
                console.error("Không thể sao chép liên kết: ", err);
            });
    };

    const formatPrivacy = (privacy) => {
        switch (privacy) {
            case 'public':
                return <span className="text-blue-500">công khai</span>;
            case 'friends':
                return <span className="text-green-500">bạn bè</span>;
            case 'private':
                return <span className="text-black">chỉ mình tôi</span>;
            default:
                return <span>{privacy}</span>;
        }
    };
    const { setShowZom } = useUser();
    const openModal = (file) => {
        setShowZom({ file: file, show: true });
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {displayedPosts.map((post) => (
                        <div
                            key={post._id}
                            className="flex items-start p-6 border border-gray-300 rounded-lg shadow-md shadow-zinc-300 gap-3"
                        >
                            <AVTUser user={post.author} />
                            <div className="grid gap-2 w-full">
                                <div className="flex justify-between">
                                    <article className="text-wrap grid gap-5">
                                        <div className="grid">
                                            <Link className=" break-words w-screen max-w-xl font-bold text-lg hover:link" to={`/user/${post.author._id}`}>
                                                {post.author.lastName} {post.author.firstName}
                                            </Link>
                                            <div className="flex gap-2">
                                                <span className="text-xs">{formatDate(post.createdAt)}</span>
                                                <span className="text-xs">{formatPrivacy(post.privacy)}</span>
                                            </div>
                                        </div>
                                        <p className='break-words w-screen max-w-xl'>{post.content}</p>
                                    </article>
                                    {userLogin._id === post.author._id ? (
                                        <DropdownPostPersonal postId={post._id} />
                                    ) : (
                                        <DropdownOtherPost postId={post._id} />
                                    )}
                                </div>
                                {post.img.length > 0 && (
                                    <div className="carousel rounded-box w-96 h-64 relative">
                                        {post.img.length > 1 && (
                                            <button
                                                onClick={() => handlePrev(post)}
                                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                                            >
                                                ‹
                                            </button>
                                        )}
                                        <div className="carousel-item w-full">
                                            {post.img[currentIndexes[post._id] || 0]?.endsWith('.mp4') ||
                                                post.img[currentIndexes[post._id] || 0]?.endsWith('.webm') ||
                                                post.img[currentIndexes[post._id] || 0]?.endsWith('.ogg') ? (
                                                <video
                                                    className="w-full h-full object-cover"
                                                    controls
                                                >
                                                    <source
                                                        src={post.img[currentIndexes[post._id] || 0]}
                                                        type="video/mp4"
                                                    />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={post.img[currentIndexes[post._id] || 0]}
                                                    className="w-full h-full object-cover"
                                                    alt="Post visual"
                                                    onClick={() => {
                                                        openModal(post.img[currentIndexes[post._id] || 0])
                                                    }}
                                                />
                                            )}
                                        </div>
                                        {post.img.length > 1 && (
                                            <button
                                                onClick={() => handleNext(post)}
                                                className="absolute object-cover w-full  h-full right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                                            >
                                                ›
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleLikeClick(post._id)}
                                            className={"flex items-end gap-1"}
                                        >
                                            {post.likes.includes(userLogin._id) ? (
                                                <HandThumbUpIcon className="size-5 animate__heartBeat" color="blue" />
                                            ) : (
                                                <HandThumbUpIcon className="size-5 hover:text-blue-700" />
                                            )}
                                            <span>{post.likes.length}</span>
                                        </button>
                                        <button
                                            onClick={() => handleDislikeClick(post._id)}
                                            className={"flex items-end gap-1 "}
                                        >
                                            {post.dislikes.includes(userLogin._id) ? (
                                                <HandThumbDownIcon className="size-5 animate__heartBeat" color="red" />
                                            ) : (
                                                <HandThumbDownIcon className="size-5 hover:text-red-700" />
                                            )}
                                            <span>{post.dislikes.length}</span>
                                        </button>
                                    </div>
                                    <Link to={`/post/${post._id}`} className={"flex items-end gap-1"}>
                                        <ChatBubbleLeftIcon className="size-5" />
                                        <span>{post.comments.length}</span>
                                    </Link>
                                    <button
                                        onClick={() => handleCopyLink(post._id)}
                                        className={"flex items-end gap-1"}>
                                        <ShareIcon className="size-5" />

                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {postsToShow < posts.length && (
                        <button
                            onClick={loadMorePosts}
                            className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Load More
                        </button>
                    )}
                </>
            )}
        </>
    );
}
