import { io } from "socket.io-client";

const URL = "http://localhost:3002"; // Địa chỉ WebSocket server của bạn
const socket = io(URL, {
  extraHeaders: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJiMjIyOTkxZWYxYzE5NGZhYmE2NGQiLCJpYXQiOjE3MzM5MTc5NjAsImV4cCI6MTczMzkyMTU2MH0.iOv82KlzLhmo03o9OOB-h0bgl4zp0H6KU77VJnvUNig`,
  },
});

export default socket;
