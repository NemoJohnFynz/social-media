import axios from 'axios';
import authToken from '../components/authToken';
const AddFriend = async (id) => {
    try {
        const response = await axios.post(`http://localhost:3001/user/friendrequest/${id}`, {},
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );
        if (response.data) {
            return { success: true, data: response.data, message: 'đã gửi yêu cầu kết bạn thành công' };
        } else {
            return { success: false, message: 'ôi không có lỗi gì đó' };
        }
    } catch (response) {
        return { success: false, message: response.response.data.message };
    }
};
const getListFriendRequest = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/user/getMyFriendRequest`,
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );
        return { success: true, data: response.data };
    } catch (response) {
        return { success: false, data: response.response.data.message };
    }
};
const getListMyFriend = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/user/getMyFriend`,
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );
        return { success: true, data: response.data };
    } catch (response) {
        return { success: false, data: response.response.data.message };
    }
};
const accectRequestAddFriend = async (id) => {
    try {

        const response = await axios.post(`http://localhost:3001/user/acceptfriend/${id}`, {},
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );

        return { success: true, data: response };
    } catch (response) {
        return { success: false, data: response.response.data.message };
    }
};
const declineRequestAddFriend = async (id) => {
    try {
        const response = await axios.post(`http://localhost:3001/user/rejectFriendRequest/${id}`, {},
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );

        return { success: true, data: response.data };
    } catch (response) {
        return { success: false, data: response.response.data.message };
    }
};
const checkFriend = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3001/user/getAllUser`, {
            headers: { Authorization: `Bearer ${authToken.getToken()}` },
        });

        // Find the user with the matching id
        const user = response.data.find((user) => user._id === id);

        if (user) {
            return { success: true, status: user.status }; // Return the status if the user is found
        } else {
            return { success: false, message: "User not found" }; // Handle case where user is not found
        }
    } catch (error) {
        console.error("Error checking friend status:", error.message);
        return { success: false, message: error?.response?.data?.message || "An error occurred" };
    }
};

const cancelFriend = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3001/user/unfriend/${id}`,
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );
        
        return { success: true, data: response.data };
    } catch (response) {
        return { success: false, data: response.response.data.message };
    }
};

async function getListFriendAnother(userId) {
    try {
        const request = await axios.get(`http://localhost:3001/user/getlistfriendanother/${userId}`,
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        )
        return request
    } catch (error) {

    }
}
export default {
    AddFriend,
    getListFriendRequest,
    accectRequestAddFriend,
    declineRequestAddFriend,
    cancelFriend,
    getListMyFriend,
    getListFriendAnother,
    checkFriend,
}