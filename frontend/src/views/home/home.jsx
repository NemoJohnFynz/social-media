
import Post from "../post/PostPersonal.jsx";
import PostStatus from "../post/components/PostStatus.jsx";
import { useState, useEffect } from "react";
import { profileUserCurrent } from "../../service/ProfilePersonal.js";
import Story from "../story/Story.jsx";
import HomePost from "../post/HomePost.jsx";

function Home() {
    const [user, setUser] = useState({})
    useEffect(() => {
        const fetchdata = async () => {
            const response = await profileUserCurrent();
            if (response && response.data) {
                setUser(response.data)
            }
        }
        fetchdata()
    }, [])
    return (
        <div className="flex justify-center">
            <div className="grid gap-5 mt-3 rounded-md pb-4 max-w-[750px]">
                <Story />
                <PostStatus user={user} />
                <HomePost />
            </div>
        </div>

    );
}
export default Home;
