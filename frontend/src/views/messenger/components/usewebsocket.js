// useWebSocket.js
import { useEffect } from 'react';
import socket from './socket';

const useWebSocket = (onMessageReceived) => {
  useEffect(() => {
    // Listen for 'newmessage' from the WebSocket server
    socket.on('newmessage', (data) => {
      console.log('Received new message:', data);
      onMessageReceived(data); // Call the callback with the new message data
    });

    // Cleanup on component unmount
    return () => {
      socket.off('newmessage');
    };
  }, [onMessageReceived]);

  return { socket }; // You can use the socket instance for other operations if needed
};

export default useWebSocket;
