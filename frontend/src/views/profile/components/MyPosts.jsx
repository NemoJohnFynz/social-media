import React from 'react'
import PostPersonal from '../../post/PostPersonal.jsx'
import PostStatus from '../../post/components/PostStatus.jsx'
import { useState, useEffect } from 'react'
import { profileUserCurrent } from '../../../service/ProfilePersonal.js'




export default function MyPosts() {
    const [userLogin, setUserLogin] = useState({})
    
    useEffect(() => {
        const fetchdata = async () => {
            const responseUserPersonal = await profileUserCurrent()
            setUserLogin(responseUserPersonal?.data)
        }
        fetchdata()
    }, []);
    return (
        <div className="grid gap-5  mt-5 rounded-md">
            <PostStatus user={userLogin} />
            <div>
                <p className='text-xl '>Bài viết của tôi</p>
                <div className='grid gap-3'>
                    <PostPersonal user={userLogin} />
                </div>
            </div>
        </div>

    )
}
