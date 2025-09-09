import { io } from "socket.io-client";

const URL = "http://localhost:8000"; // backend server
let socket;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(URL, {
      query: { userId }, // pass userId for mapping
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
