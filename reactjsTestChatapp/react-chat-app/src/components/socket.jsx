import { io } from "socket.io-client";

const URL = "http://localhost:3001"; // Địa chỉ WebSocket server của bạn
const socket = io(URL, {
  extraHeaders: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzJhZWJhNTY3NWIzMDNkNDA0MDIyYTMiLCJpYXQiOjE3MzUwOTIzNjUsImV4cCI6MTczNTExMDM2NX0.YrQewjqlni6AHzzg4NVJgpVuxhWyHRO_Sx-QTAimgBs`,
  },
});

export default socket;
