import axios from "axios";
import authToken from "../components/authToken";

export async function profileUserCurrent() {
    try {
        var request = await axios.get(`http://localhost:3001/user/current`, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {
        console.log(error)
    }
}

export async function updateName(firstName, lastName) {
    try {
        const request = await axios.put(`http://localhost:3001/user/update`, { firstName, lastName }, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {
        console.log(error)
    }
}

export async function updateInformation(birthday, gender, address) {
    try {
        const request = await axios.put(`http://localhost:3001/user/update`, { birthday, gender, address }, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`
            }
        })
        return request
    } catch (error) {
        console.log(error)
    }
}

export async function uploadAvatar(file) {
    try {
        const formData = new FormData();
        formData.append('files', file);
        const request = await axios.post(`http://localhost:3001/user/upload-avatar`, formData, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        return request
    } catch (error) {
        console.log(error)
    }
}

export async function uploadBackground(file) {
    try {
        const formData = new FormData();
        formData.append('files', file);
        const request = await axios.post(`http://localhost:3001/user/uploadcoveravatar`, formData, {
            headers: {
                Authorization: `Bearer ${authToken.getToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        return request
    } catch (error) {
        console.log(error)
    }
}