import { MENU_ITEMS } from "@/constants";
import { actionItemClick } from "@/slice/menuSlice";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "./../../socket";

const Board = () => {
    const canvasRef = useRef(null);
    const drawRef = useRef(false);
    const drawHistory = useRef([]);
    const historyPointer = useRef(0);
    const dispatch = useDispatch();

    const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu)
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItem])

    useLayoutEffect(() => {
        if(!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, []);

    useEffect(() => {
        if(!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.strokeStyle = color;
        context.lineWidth = size;

        const beginPath = (x, y) => {
            context.beginPath();
            context.moveTo(x, y);
        }

        const moveMouse = (x, y) => {
            context.lineTo(x, y);
            context.stroke();
        }

        const handleMouseDown = (e) => {
            drawRef.current = true;
            beginPath(e.clientX, e.clientY);
            socket.emit('beginPath', {x: e.clientX, y: e.clientY});
        }

        const handleMouseMove = (e) => {
            if(!drawRef.current) return;
            moveMouse(e.clientX, e.clientY);
            socket.emit("drawLine", {x: e.clientX, y: e.clientY});
        }

        const handleMouseUp = () => {
            drawRef.current = false;
            const dataImage = context.getImageData(0, 0, canvas.width, canvas.height);
            drawHistory.current.push(dataImage);
            historyPointer.current = drawHistory.current.length - 1;
        }

        const handleBeginPath = (path) => {
            beginPath(path.x, path.y);
        }

        const handleDrawline = (path) => {
            moveMouse(path.x, path.y)
        }

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        socket.on('beginPath', handleBeginPath);
        socket.on('drawLine', handleDrawline);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        }
    }, [activeMenuItem,color,size]);

    useEffect(() => {
        if(!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if(actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const URL = canvas.toDataURL();
            const anchor = document.createElement("a");
            anchor.href = URL;
            anchor.download = "sketch.jpg";
            anchor.click();
        } else if(actionMenuItem === MENU_ITEMS.UNDO) {
            if(historyPointer.current > 0) {
                const imageData = drawHistory.current[historyPointer.current-1];
                context.putImageData(imageData, 0, 0);
                historyPointer.current -= 1;
            }
        } else if(actionMenuItem === MENU_ITEMS.REDO) {
            if(historyPointer.current < drawHistory.current.length-1) {
                const imageData = drawHistory.current[historyPointer.current+1];
                context.putImageData(imageData, 0, 0);
                historyPointer.current += 1;
            }
        }

        dispatch(actionItemClick(null));
    },[actionMenuItem, dispatch]);

    return (
        <canvas ref={canvasRef}></canvas>
    )
}

export default Board;