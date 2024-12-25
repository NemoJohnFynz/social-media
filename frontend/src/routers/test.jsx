import { io } from 'socket.io-client';
import apiuri from '../service/apiuri';

import authToken from '../components/authToken';

const URL = apiuri.Socketuri();

const Test = () => {
    // Kết nối đến WebSocket server
    const socket = io(URL, {
        extraHeaders: {
            Authorization: `Bearer ${authToken.getToken()}`,
        },
    });

    // Lắng nghe sự kiện kết nối thành công
    socket.on('connect', () => {
        console.log('Connected to WebSocket server with ID:', socket.id);

        // Gửi thông điệp "abc" đến server
        socket.emit('messageEvent', { message: 'abc' });
    });

    // Lắng nghe phản hồi từ server
    socket.on('responseEvent', (data) => {
        console.log('Response from server:', data); // Dự kiến nhận "abcd"
    });

    // Xử lý sự kiện ngắt kết nối
    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
    });

    return (
        <div>
            WebSocket Test Component
        </div>
    );
};

export default Test;
