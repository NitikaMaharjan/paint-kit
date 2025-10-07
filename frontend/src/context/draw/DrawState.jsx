import { useEffect, useState, useRef } from "react";
import DrawContext from "./DrawContext";

export default function DrawState(props) {

    const [drawing, setDrawing] = useState(false);
    const [tool, setTool] = useState("pen");
    const [selectedColor, setSelectedColor] = useState("#000000");

    const canvasRef = useRef(null);

    const handleMouseDown = (e)=> {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // finding the mouse position relative to the canvas not the whole screen
        const canvasBox = canvas.getBoundingClientRect();
        const posX = e.clientX - canvasBox.left;
        const posY = e.clientY - canvasBox.top;

        if(tool==="pen"){
            setDrawing(true);
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.strokeStyle = selectedColor;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
        }else if(tool==="eraser") {
            setDrawing(true);
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
        }
    }

    const handleMouseMove = (e) => {
        if (drawing===false){
            return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const canvasBox = canvas.getBoundingClientRect();
        const posX = e.clientX - canvasBox.left;
        const posY = e.clientY - canvasBox.top;
        ctx.lineTo(posX, posY);
        ctx.stroke();
    };

    const handleMouseUp = ()=> {
        if (tool==="pen"){
            setDrawing(false);
        }
    }

    return(
        <DrawContext.Provider value={{ canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, setTool}}>
            {props.children}
        </DrawContext.Provider>
    );
}