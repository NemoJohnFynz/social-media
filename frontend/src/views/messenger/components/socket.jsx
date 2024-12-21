import { io } from "socket.io-client";
import authToken from "../../../components/authToken";
const URL = "http://localhost:3002"; // Địa chỉ WebSocket server của bạn
const socket = io(URL, {
  extraHeaders: {
    Authorization: `Bearer ${authToken.getToken()}`,
  },
});

export default socket;
