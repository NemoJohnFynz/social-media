import axios from 'axios';
import authToken from '../components/authToken';
import Apiuri from './apiuri';
import { useCallback } from 'react';
import socket from './webSocket/socket';
import useWebSocket from './webSocket/usewebsocket';
const url = Apiuri.Apiuri()

const AddFriend = async (id) => {

    try {
        const result = await axios.get(`${url}/friend/status/${id}`,
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );
        console.log(result.data.status)
        if (result.data.status == 'no_request') {
            const response = await axios.post(`${url}/user/friendrequest/${id}`, {},
                {
                    headers: { Authorization: `Bearer ${authToken.getToken()}` },
                }
            );
            if (response.data) {
                // Phát tín hiệu WebSocket sau khi yêu cầu thành công
                socket.emit("addFriend", response.data);
                return { success: true, data: response.data, message: 'đã gửi yêu cầu kết bạn thành công' };
            } else {
                return { success: false, message: 'ôi không có lỗi gì đó' };
            }
        } else {
            return { success: false, message: 'ôi không có lỗi gì đó chắc chắn là bị trùng request' };
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu kết bạn',
        };
    }
};

const getListFriendRequest = async () => {
    try {
        const response = await axios.get(`${url}/user/getMyFriendRequest`,
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
        const response = await axios.get(`${url}/user/getMyFriend`,
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

        const response = await axios.post(`${url}/user/acceptfriend/${id}`, {},
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
        const response = await axios.post(`${url}/user/rejectFriendRequest/${id}`, {},
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
        const response = await axios.get(`${url}/friend/status/${id}`,
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );
        return { success: true, data: response.data };
    } catch (response) {
        return { success: false, data: response.response.data.message };
    }
};

const cancelFriend = async (id) => {
    try {
        const response = await axios.delete(`${url}/user/unfriend/${id}`,
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );

        return { success: true, data: response.data };
    } catch (response) {
        return { success: false, data: response.response.data.message };
    }
};
const cancelFriendRequest = async (id) => {
    const remove = async (idrq) => {
        console.log(idrq); // For debugging, ensure this ID is valid

        try {
            // Make the DELETE request
            const response = await axios.delete(`${url}/user/removeFriendRequest/${idrq}`, {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            });

            // Check if the response indicates success (statusCode 200)
            if (response.data.statusCode === 200) {
                return { success: true, data: response.data.message };
            } else {
                // If the statusCode is not 200, it's still an error
                return { success: false, data: response.data.message };
            }
        } catch (error) {
            // Catching any error that occurs during the request
            console.error("Error removing friend request:", error.response?.data?.message || error.message);
            return { success: false, data: error.response?.data?.message || error.message };
        }
    };

    try {
        //statusCode
        const userrequest = await axios.get(`${url}/user/getMyFriendRequest`,
            {
                headers: { Authorization: `Bearer ${authToken.getToken()}` },
            }
        );
        const idRequest = userrequest.data
            .filter((item) => item.receiver !== id && item.sender !== id)
            .map((item) => item._id);
        console.log('id tren:')
        console.log(idRequest)
        let idrq = [];
        if (idRequest.length == 0) {
            const userrequest = await axios.get(`${url}/friend/status/${id}`,
                {
                    headers: { Authorization: `Bearer ${authToken.getToken()}` },
                }
            );
            console.log('id duoi:')
            console.log(userrequest?.data?.idRequest)
            idrq = userrequest?.data?.idRequest
        } else {
            idrq = idRequest
        }
        const rmv = await remove(idrq);
        console.log(rmv)
        console.log('da thuc thi')
        if (rmv.success == false) {
            const response = await axios.post(`${url}/user/rejectFriendRequest/${idrq}`, {},
                {
                    headers: { Authorization: `Bearer ${authToken.getToken()}` },
                }
            );
            return { success: true, data: response.data };
        } else {
            return { success: true, data: rmv };
        }
    } catch (response) {
        return { success: false, data: response.response.data.message };
    }
};
async function getListFriendAnother(userId) {
    try {
        const request = await axios.get(`${url}/user/getlistfriendanother/${userId}`,
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
    cancelFriendRequest,
}