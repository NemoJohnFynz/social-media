import axios from "axios";
import authToken from "../components/authToken";

//post user current
export async function getPostPersonal() {
    try {
        const request = await axios.get(`http://localhost:3001/post/crpost`,
            {
                headers: {
                    Authorization: `Bearer ${authToken.getToken()}`, // Use your auth token provider
                    'Content-Type': 'application/json'
                }
            }
        )
        return request.data
    } catch (error) {

    }
}
//getHomeFeed
export async function getHomeFeed() {
    try {
        const request = await axios.get(`http://localhost:3001/post/getHomeFeed`,
            {
                headers: {
                    Authorization: `Bearer ${authToken.getToken()}`, // Use your auth token provider
                    'Content-Type': 'application/json'
                }
            }
        )
        return request
    } catch (error) {

    }
}
//Like
export async function handleLike(postId) {
    try {
        const request = await axios.put(`http://localhost:3001/post/${postId}/like`, {}, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {

    }
}
//unlike
export async function handleUnLike(postId) {
    try {
        const request = await axios.put(`http://localhost:3001/post/${postId}/unlike`, {}, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {

    }
}

// Dislike
export async function handleDisLike(postId) {
    try {
        const request = await axios.put(`http://localhost:3001/post/${postId}/dislike`, {}, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {

    }
}
//undislike
export async function handleUnDisLike(postId) {
    try {
        const request = await axios.put(`http://localhost:3001/post/${postId}/undislike`, {}, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {

    }
}
// bookmark
//add
export async function handleAddBookmark(postId) {
    try {
        const request = await axios.post(`http://localhost:3001/user/${postId}/bookmark`, {}, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {

    }
}
//remove
export async function handleRemoveBookmark(postId) {
    try {
        const request = await axios.delete(`http://localhost:3001/user/${postId}/bookmark`, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {

    }
}
//getallBookmark from myself
export async function getAllBookmark(userId) {
    try {
        const request = await axios.get(`http://localhost:3001/user/${userId}/bookmark`, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {

    }
}