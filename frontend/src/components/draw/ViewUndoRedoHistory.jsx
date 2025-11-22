import { useContext, useEffect, useState } from "react";
import DrawContext from "../../context/draw/DrawContext";
import CanvasItem from "./CanvasItem";

export default function ViewUndoRedoHistory() {

    const { canvasRef, undoStack, redoStack } = useContext(DrawContext);

    const [currentCanvasStateImage, setCurrentCanvasStateImage] = useState("");

    useEffect(() => {
        const canvas = canvasRef.current;
        const currentCanvasStateImageUrl = canvas.toDataURL("image/jpeg");
        setCurrentCanvasStateImage(currentCanvasStateImageUrl);
        // eslint-disable-next-line
    }, []);    
    
    return (
        <div className="flex gap-12">
            <div>
                {
                    undoStack.current.length>0?
                        <>
                            <p>undo stack is not empty {undoStack.current.length}</p>
                            {undoStack.current.map((imageData, index)=>{
                                return <CanvasItem key={index} imageData={imageData}/>
                            }).reverse()}
                        </>
                    :
                        <>
                            undo stack is empty
                        </>                
                }
            </div>
            <div>
                <h1>Current Canvas State</h1>
                <img src={currentCanvasStateImage} style={{height: "200px", width: "400px"}}/>
            </div>            
            <div>
                {
                    redoStack.current.length>0?
                        <>
                            <p>redo stack is not empty {redoStack.current.length}</p>
                            {redoStack.current.map((imageData, index)=>{
                                return <CanvasItem key={index} imageData={imageData}/>
                            }).reverse()}
                        </>
                    :
                        <>
                            redo stack is empty
                        </>                
                }
            </div>
        </div>
    );
}