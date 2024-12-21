import React from 'react'
import { useState, useEffect } from 'react'
import { getAllBookmark, getHomeFeed, handleRemoveBookmark } from '../../service/PostService'
import { profileUserCurrent } from '../../service/ProfilePersonal'
import Loading from '../../components/Loading'

export default function Bookmark() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const fetchUserId = async () => {
        const response = await profileUserCurrent();
        if (response) {
            return response.data._id
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const id = await fetchUserId();
            const [responsePost, response] = await Promise.all([getHomeFeed(), getAllBookmark(id)]);

            if (response && responsePost) {
                const bookmarks = response.data.bookmarks;
                const matchedPosts = responsePost.data.filter(post => bookmarks.includes(post._id));
                setData(matchedPosts);
            }
            setLoading(false);
        };
        setTimeout(fetchData, 1000); // Delay of 5 seconds
    }, [])

    const handleBookmarkClick = async (postId) => {
        try {
            await handleRemoveBookmark(postId);
            setData(prevData => prevData.filter(post => post._id !== postId));
            alert('Đã bỏ lưu');
        } catch (error) {
            console.error('Error bookmarking post:', error);
        }
    };
    return (
        <div className='grid place-items-center mt-5 gap-4'>
            <h1 className='text-2xl font-semibold '>Tất cả bài viết đã lưu</h1>
            <div className='grid grid-cols-3 gap-5'>
                {loading ? (
                    <Loading />
                ) : (
                    data.length > 0 ? (
                        data.map((post, index) => (
                            <div key={index} className="card bg-base-100 w-[400px] shadow-xl border-[1px]">
                                <div className="card-body">
                                    <h2 className="card-title">{post.content}</h2>
                                    <img
                                        className='rounded-sm'
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                        src="https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwAAAA?rs=1&pid=ImgDetMain" alt="" />
                                    <a>bài viết đã lưu của: {post.author.firstName} {post.author.lastName}</a>

                                    <div className="card-actions justify-end mt-3">
                                        <button onClick={() => handleBookmarkClick(post._id)} className="btn btn-error text-white">Bỏ lưu</button>
                                        <button className="btn btn-primary">Xem bài viết</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (<span>Chưa lưu bài viết nào!</span>))}
            </div>
        </div>
    )
}
