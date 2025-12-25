import { useContext, useEffect, useState } from "react";
import DrawContext from "../../context/draw/DrawContext";
import CanvasItem from "./CanvasItem";

export default function ViewUndoRedoHistory(props) {

    const { canvasRef, undoStack, redoStack } = useContext(DrawContext);

    const [currentCanvasStateImage, setCurrentCanvasStateImage] = useState("");

    useEffect(() => {
        const canvas = canvasRef.current;
        const currentCanvasStateImageUrl = canvas.toDataURL("image/jpeg");
        setCurrentCanvasStateImage(currentCanvasStateImageUrl);
        // eslint-disable-next-line
    }, []);    
    
    return (
        <div className="view-history-modal">
            <div>
                {
                    undoStack.current.length > 0 ?
                        <>
                            <p className="text-center">undo stack is not empty</p>
                            <p className="text-center"><b>Length: {undoStack.current.length}</b></p><br/>
                            <div style={{height: "540px", width: "280px", overflowY: "auto", scrollbarGutter: "stable"}}>
                                {undoStack.current.map((imageData, index)=>{
                                    return <CanvasItem key={index} imageData={imageData} setShowUndoRedoHistoryModal={props.setShowUndoRedoHistoryModal}/>
                                }).reverse()}
                            </div>
                        </>
                    :
                        <p className="text-center">undo stack is empty</p>            
                }
            </div>
            <div>
                <h1 className="text-center">Current canvas state</h1><br/>
                <img src={currentCanvasStateImage} style={{height: "200px", width: "400px"}} alt="drawing"/>
            </div>            
            <div>
                {
                    redoStack.current.length > 0 ?
                        <>
                            <p className="text-center">redo stack is not empty</p>
                            <p className="text-center"><b>Length: {redoStack.current.length}</b></p><br/>
                            <div style={{height: "540px", width: "280px", overflowY: "auto", scrollbarGutter: "stable"}}>
                                {redoStack.current.map((imageData, index)=>{
                                    return <CanvasItem key={index} imageData={imageData} setShowUndoRedoHistoryModal={props.setShowUndoRedoHistoryModal}/>
                                }).reverse()}
                            </div>
                        </>
                    :
                        <p className="text-center">redo stack is empty</p>            
                }
            </div>
        </div>
    );
}