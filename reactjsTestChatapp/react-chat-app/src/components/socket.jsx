import { io } from "socket.io-client";

const URL = "http://localhost:3001"; // Địa chỉ WebSocket server của bạn
const socket = io(URL, {
  extraHeaders: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJhZWJhNTY3NWIzMDNkNDA0MDIyYTMiLCJpYXQiOjE3MzUwODg1NTcsImV4cCI6MTczNTEwNjU1N30.dAuI0tRXBZcHxPdDnjS6XTLn8BE7tcS6YS6j3uNZVas`,
  },
});

export default socket;
