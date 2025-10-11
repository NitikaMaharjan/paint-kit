import { useContext, useEffect } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function Canvas() {

    const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp } = useContext(DrawContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true }); // ctx in short for drawing context is an object that gives you all the drawing tools
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // eslint-disable-next-line
    }, []);

    return (
        <div style={{marginTop: "20px", marginLeft: "120px"}}>
            <canvas ref={canvasRef} height={"498px"} width={"918px"} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
        </div>
    )
}
