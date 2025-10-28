import { useContext, useEffect } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function Canvas(props) {

    const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, undoStack, redoStack } = useContext(DrawContext);

    useEffect(() => {
        if (props.url===""){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d", { willReadFrequently: true }); // ctx in short for drawing context is an object that gives you all the drawing tools
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        // eslint-disable-next-line
    }, []);
    
    useEffect(() => {
        if (props.url!==""){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            const img = new Image();
            img.src = props.url;

            img.onload = ()=> {
                if(props.url.includes("/uploads/")){
                    const imgAspect = img.width / img.height;
                    const canvasAspect = canvas.width / canvas.height;
    
                    let drawWidth, drawHeight;
    
                    if (imgAspect>canvasAspect){
                        drawWidth = canvas.width;
                        drawHeight = canvas.width / imgAspect;
                    }else{
                        drawHeight = canvas.height;
                        drawWidth = canvas.height * imgAspect;
                    }
    
                    const offsetX = (canvas.width - drawWidth) / 2;
                    const offsetY = (canvas.height - drawHeight) / 2;
    
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                }else{
                    ctx.drawImage(img, 0, 0);
                }
            }
            img.onerror = ()=> {
                showAlert("Error", "Failed to load image. Please try again!");
            }
        }        
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
      undoStack.current = [];
      redoStack.current = [];
      // eslint-disable-next-line
    }, []);    

    return (
        <div style={{marginTop: "20px", marginLeft: "120px"}}>
            <canvas ref={canvasRef} height={"498px"} width={"918px"} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
        </div>
    )
}
