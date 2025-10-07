import { useEffect, useState, useRef } from "react";

export default function Canvas() {

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

        setDrawing(true);
        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
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

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d"); // ctx in short for drawing context is an object that gives you all the drawing tools
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    return (
        <canvas ref={canvasRef} height={"612px"} width={"1058px"} style={{border: "1px solid black"}} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
    )
}
