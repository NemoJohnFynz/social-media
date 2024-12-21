import { useState, useEffect } from "react";
import user from "../../../service/user"; // Ensure you import the correct service or API client
import imgUser from '../../../img/user.png'
import Loading from "../../../components/Loading";
const UserFriendCard = ({ iduser }) => {
    const [userdata, setUserdata] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchdata = async () => {
            if (iduser) { // Check if iduser is valid
                try {
                    console.log('Fetching data for id:', iduser);
                    const res = await user.getProfileUser(iduser);
                    if (res.success) {
                        setUserdata(res.data);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false); // Stop loading
                }
            }
        };

        fetchdata();
    }, [iduser]); // Run effect when iduser changes
    // console.log(userdata)
    if (loading) {
        return (
            <Loading/>
        );
    }

    return (
        <>
            <img
                src={
                    userdata?.avatar
                        ? userdata.avatar
                        : imgUser
                }
                alt="user" className="w-10 h-10 rounded-full mr-2" />
            <div className="text-start line-clamp-3">
                <h3 className="font-semibold">
                    {userdata
                        ? `${userdata.lastName || ''} ${userdata.firstName || ''}`.trim()
                        : "No Name"}
                </h3>
                <p className="text-gray-400 line-clamp-1">ô no không có tin xem trướcccccccccccccc</p>
            </div>
        </>
    );
};

export default UserFriendCard;
