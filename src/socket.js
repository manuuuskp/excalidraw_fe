import { io } from "socket.io-client";
const URL = process.env.NODE_ENV === 'production' ? 'https://excalidraw-2y7k.onrender.com' : 'http://localhost:5000'
export const socket = io(URL);