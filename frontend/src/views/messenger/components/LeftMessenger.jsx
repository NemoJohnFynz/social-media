import { useState, useEffect } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import friend from "../../../service/friend";
import UserFriendCard from "./userFriendCard";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Loading from "../../../components/Loading";

const LeftMessenger = () => {
    const [alignment, setAlignment] = useState("web");
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // React Router navigation function

    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await friend.getListMyFriend();
                if (res.success) {
                    setFriends(res.data);
                } else {
                    setFriends([]);
                }
            } catch (error) {
                console.error("Error fetching friend list:", error);
                setFriends([]);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchdata();
        console.log(friends)
    }, []);
    

    return (
        <div className="border-r-gray-300 border-r h-full flex flex-col">
            <div className="w-full flex justify-center">
                <ToggleButtonGroup
                    className="flex justify-center bg-white w-full max-w-lg h-14 rounded-none"
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="web" className="flex-1 font-medium transition-all hover:bg-blue-50">
                        InBox
                    </ToggleButton>
                    <ToggleButton value="android" className="flex-1 font-medium transition-all hover:bg-blue-50">
                        Nhóm
                    </ToggleButton>
                    <ToggleButton value="ios" className="flex-1 font-medium transition-all hover:bg-blue-50">
                        New
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            {
                loading ?
                    <Loading/> 
                    :
                    <ul
                        className="h-full flex flex-col px-2"
                        style={{
                            overflowY: "scroll",
                            scrollbarWidth: "none", // Firefox
                            msOverflowStyle: "none", // Internet Explorer and Edge
                        }}
                    >
                        {friends.map((friend, index) => (
                            <li key={index}>
                                <button
                                    onClick={() =>
                                        navigate(`inbox/?iduser=${friend?.receiver?._id || friend?.sender?._id}`)
                                    }
                                    className="flex items-center py-2 w-full"
                                >
                                    {friend.receiver && friend.receiver._id && (
                                        <UserFriendCard iduser={friend.receiver._id} />
                                    )}
                                    {friend.sender && friend.sender._id && (
                                        <UserFriendCard iduser={friend.sender._id} />
                                    )}
                                </button>
                            </li>
                        ))}

                    </ul>
            }


        </div>
    );
};

export default LeftMessenger;
