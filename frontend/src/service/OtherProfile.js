import axios from "axios";
import authToken from "../components/authToken";

export async function OtherProfile(id) {
    try {
        const request = axios.get(`http://localhost:3001/user/getDetailUser/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken.getToken()}`
                }
            }
        )
        return request
    } catch (error) {

    }
}
export async function getAllOtherPosts(id) {
    try {
        const request = axios.get(`http://localhost:3001/post/friend/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken.getToken()}`
                }
            }
        )
        return request
    } catch (error) {

    }
}