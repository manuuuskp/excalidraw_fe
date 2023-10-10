import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { MENU_ITEMS, SUB_MENU_ITEMS } from "@/constants";
import { actionItemClick } from '@/slice/menuSlice'

import { socket } from "@/socket";

import classes from "./index.module.css";

const Board = () => {
    const dispatch = useDispatch()
    const canvasRef = useRef(null)
    const drawHistory = useRef([])
    const historyPointer = useRef(0)
    const startX = useRef(null);
    const startY = useRef(null);
    const shouldDraw = useRef(false)
    const {activeMenuItem, actionMenuItem, activeSubMenuItem} = useSelector((state) => state.menu)
    const activeToolBoxItem = useSelector((state) => state.toolbox[activeSubMenuItem])


    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const URL = canvas.toDataURL()
            const anchor = document.createElement('a')
            anchor.href = URL
            anchor.download = 'sketch.jpg'
            anchor.click()
        } else  if (actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO) {
            if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current -= 1
            if(historyPointer.current < drawHistory.current.length - 1 && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current += 1
            const imageData = drawHistory.current[historyPointer.current]
            context.putImageData(imageData, 0, 0)
        }
        dispatch(actionItemClick(null))
    }, [actionMenuItem, dispatch])

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        const changeConfig = (color, size) => {
            if(activeSubMenuItem === SUB_MENU_ITEMS.HIGHLIGHTER) {
                context.strokeStyle = `${color}10`
            } else {
                context.strokeStyle = color;
            }
            context.lineWidth = size;
        }

        const handleChangeConfig = (config) => {
            changeConfig(config.color, config.size)
        }
        changeConfig(activeToolBoxItem?.color, activeToolBoxItem?.size)
        socket.on('changeConfig', handleChangeConfig)

        return () => {
            socket.off('changeConfig', handleChangeConfig)
        }
    }, [activeToolBoxItem?.color, activeToolBoxItem?.size, activeSubMenuItem]);

    useEffect(() => {
        if(!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if(activeSubMenuItem === SUB_MENU_ITEMS.HIGHLIGHTER) {
            console.log('globalAlpha')
            context.globalAlpha = 0.5;
        } else {
            context.globalAlpha = 1;
        }
    }, [activeSubMenuItem]);

    // before browser pain
    useLayoutEffect(() => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let ctx = canvas.getContext("2d");
      let s = 90;

      ctx.strokeStyle = "lightgrey";
      ctx.beginPath();
      for (var x = 0; x <= window.innerWidth; x += s) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window.innerHeight);
      }
      for (var y = 0; y <= window.innerHeight; y += s) {
        ctx.moveTo(0, y);
        ctx.lineTo(window.innerWidth, y);
      }
      ctx.stroke();
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        const beginPath = (x, y) => {
            context.beginPath()
            context.moveTo(x, y)
        }

        const drawRect = (x, y) => {
            const width = x - startX.current;
            const height = y - startY.current;

            context.strokeRect(startX.current, startY.current, width, height);
        }

        const drawLine = (x, y) => {
            context.globalAlpha = 0.2
            if(activeSubMenuItem === SUB_MENU_ITEMS.PENCIL || activeSubMenuItem === SUB_MENU_ITEMS.ERASER){
                context.lineTo(x, y);
            } else if (activeSubMenuItem === SUB_MENU_ITEMS.HIGHLIGHTER) {
                context.lineTo(x, y);
            } else if(activeMenuItem === MENU_ITEMS.SQUARE) {
                drawRect(x, y);
                // context.strokeRect(x, y, 100, 100);
            }
            context.stroke();
        }

        const handleMouseDown = (e) => {
            shouldDraw.current = true
            startX.current = e.clientX;
            startY.current = e.clientY;
            beginPath(e.clientX, e.clientY);
            socket.emit('beginPath', {x: e.clientX, y: e.clientY})
        }

        const handleMouseMove = (e) => {
            if (!shouldDraw.current) return
            drawLine(e.clientX, e.clientY, context)
            socket.emit('drawLine', {x: e.clientX, y: e.clientY})
        }

        const handleMouseUp = (e) => {
            shouldDraw.current = false
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            drawHistory.current.push(imageData)
            historyPointer.current = drawHistory.current.length - 1
        }

        const handleBeginPath = (path) => {
            beginPath(path.x, path.y)
        }

        const handleDrawLine = (path) => {
            drawLine(path.x, path.y, context);
        }

        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)

        socket.on('beginPath', handleBeginPath)
        socket.on('drawLine', handleDrawLine)

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseup', handleMouseUp)

            socket.off('beginPath', handleBeginPath)
            socket.off('drawLine', handleDrawLine)
        }
    }, [activeMenuItem, activeSubMenuItem]);

    return (<canvas ref={canvasRef} className={classes.canvas}></canvas>
    )
}

export default Board;
