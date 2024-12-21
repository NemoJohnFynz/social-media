import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from '../views/home/home.jsx';
import Myfriend from "../views/friend/myfriend.jsx";
import Layout from "../views/Layout.js";
import Personal from "../views/profile/personal/index.jsx";
import AboutProfile from "../views/profile/components/AboutProfile.jsx";
import MyPosts from "../views/profile/components/MyPosts.jsx";
import FriendProfile from "../views/friend/FriendProfile.jsx";
import LayoutMessenger from "../views/messenger/layoutMessenger.js";
import Searchpage from "../views/search/index.jsx";
import Friendinvitation from "../views/friend/friendinvitation.jsx";
import Login from "../auth/login/index.jsx";
import Register from "../auth/register/index.jsx";
import LayoutSearch from "../views/search/layout.js";
import OtherProfiles from "../views/profile/OtherProfiles/index.jsx";
import AboutOtherProfile from "../views/profile/OtherProfiles/AboutOtherProfile.jsx";
import OtherPosts from "../views/profile/OtherProfiles/OtherPosts.jsx";
import Bookmark from "../views/bookmark/page.jsx";
import MyFriendCard from "../views/friend/card/myFriendCard.jsx";
import MyAllFriend from "../views/friend/myAllFriend.jsx";
import MessengerInbox from "../views/messenger/components/messInbox.jsx";
import FriendOtherProfile from "../views/profile/OtherProfiles/FriendOtherProfile.jsx";
import authToken from "../components/authToken.jsx";

function routers() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="friends" element={<Myfriend />} >
                        <Route path="" element={<Friendinvitation />} />
                        <Route path="list" element={<MyAllFriend />} />
                        <Route path="requests" element={<Friendinvitation />} />
                    </Route>
                    <Route path="user" element={<Personal />} />
                    <Route path="search" element={<Searchpage />} />
                    <Route path="myprofile" element={<Personal />}>
                        <Route index element={<MyPosts />} />
                        <Route path="about" element={<AboutProfile />} />
                        <Route path="friends" element={<FriendProfile />} />
                    </Route>
                    <Route path="messenger" element={<LayoutMessenger />}>
                        <Route index element={<MessengerInbox />} />
                        <Route path="inbox" element={<MessengerInbox />} />
                    </Route>
                    <Route path="user/:id" element={<OtherProfiles />}>
                        <Route index element={<OtherPosts />} />
                        <Route path="about" element={<AboutOtherProfile />} />
                        <Route path="friends" element={<FriendOtherProfile />} />
                    </Route>
                    <Route path="bookmark" element={<Bookmark />} />
                    <Route path="/search" element={<LayoutSearch />}>
                        <Route path="all" element={<Searchpage />} />
                    </Route>
                </Route>
                {/* Redirect to login if not authenticated */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

            </Routes>
        </BrowserRouter>
    );
}

export default routers;
