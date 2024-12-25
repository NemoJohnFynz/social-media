import { useEffect } from 'react';
import socket from './socket';

const useWebSocket = (onMessageReceived) => {

  useEffect(() => {

    socket.on('connect', () => {
      console.log('WebSocket connected successfully');
    });

    // Listen for connection error
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection failed:', error);
    });

    // Listen for disconnection
    socket.on('disconnect', () => {
      console.warn('WebSocket disconnected');
    });

 
    socket.on('newmessage', (data) => {
      console.log('Received new message:', data);
      onMessageReceived(data); // Call the callback with the new message data
    });

    // Cleanup on component unmount
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('newmessage');
    };
  }, [onMessageReceived]);

  return { socket }; // You can use the socket instance for other operations if needed
};

export default useWebSocket;
