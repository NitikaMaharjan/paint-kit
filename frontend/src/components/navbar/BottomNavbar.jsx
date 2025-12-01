import { useContext, useEffect, useState } from "react";
import DrawContext from "../../context/draw/DrawContext";
import ViewUndoRedoHistory from "../draw/ViewUndoRedoHistory";

export default function BottomNavbar(props) {
    
    const { handleClearCanvas, handleUndo, handleRedo, setPenStrokeWidth, setEraserStrokeWidth, setColorOpacity } = useContext(DrawContext);

    const [inputPenStrokeWidth, setInputPenStrokeWidth] = useState(2);
    const [inputEraserStrokeWidth, setInputEraserStrokeWidth] = useState(4);
    const [inputColorOpacity, setInputColorOpacity] = useState(255);
    const [showUndoRedoHistoryModal, setShowUndoRedoHistoryModal] = useState(false);

    const handlePenStrokeWidthChange = (e) => {
        if(props.checkUserSignedIn()){
            setInputPenStrokeWidth(e.target.value);
        }
    }
    
    const handleEraserStrokeWidthChange = (e) => {
        if(props.checkUserSignedIn()){
            setInputEraserStrokeWidth(e.target.value);
        }
    }
    
    const handleColorOpacityChange = (e) => {
        if(props.checkUserSignedIn()){
            setInputColorOpacity(e.target.value);
        }
    }

    useEffect(() => {
        setPenStrokeWidth(inputPenStrokeWidth);
    }, [inputPenStrokeWidth]);
    
    useEffect(() => {
        setEraserStrokeWidth(inputEraserStrokeWidth);
    }, [inputEraserStrokeWidth]);
    
    useEffect(() => {
        setColorOpacity(inputColorOpacity);
    }, [inputColorOpacity]);    

    return (
        <>
            <div className="bottom-navbar">
                <div className="bottom-tool-bar">
                    <div className="flex items-center justify-between p-2">
                        <label htmlFor="pen_stroke_width">Pen Stroke Width:</label>
                        <input type="range" id="pen_stroke_width" name="pen_stroke_width" min="0" max="25" value={inputPenStrokeWidth} onChange={handlePenStrokeWidthChange}/>
                        <label htmlFor="eraser_stroke_width">Eraser Stroke Width:</label>
                        <input type="range" id="eraser_stroke_width" name="eraser_stroke_width" min="0" max="25" value={inputEraserStrokeWidth} onChange={handleEraserStrokeWidthChange}/>
                        <label htmlFor="color_opacity">Color Opacity:</label>
                        <input type="range" id="color_opacity" name="color_opacity" min="0" max="255" value={inputColorOpacity} onChange={handleColorOpacityChange}/>
                    </div>
                    <div className="flex justify-end pr-4 gap-4">
                        <button className="action-btn" onClick={handleUndo}>Undo</button>
                        <button className="action-btn" onClick={handleRedo}>Redo</button>
                        <button className="action-btn" onClick={()=>{if(props.checkUserSignedIn()){setShowUndoRedoHistoryModal(true)}}}>View Undo/Redo History</button>
                        <button className="action-btn" onClick={handleClearCanvas}>clear all</button>
                    </div>
                </div>
            </div>

            {
                showUndoRedoHistoryModal
                &&
                <div className="view-history-modal-background">
                    <div style={{position: "fixed", top: "30px", right: "30px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowUndoRedoHistoryModal(false)}}>
                        <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                    </div>
                    <ViewUndoRedoHistory setShowUndoRedoHistoryModal={setShowUndoRedoHistoryModal}/>
                </div>
            }

        </>
    );
}
