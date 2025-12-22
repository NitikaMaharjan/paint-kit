import { useContext, useEffect, useState } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function BottomNavbar(props) {
    
    const { handleUndo, handleRedo, setPenStrokeWidth, setEraserStrokeWidth, setColorOpacity, cursorPos } = useContext(DrawContext);

    const [inputPenStrokeWidth, setInputPenStrokeWidth] = useState(2);
    const [inputEraserStrokeWidth, setInputEraserStrokeWidth] = useState(4);
    const [inputColorOpacity, setInputColorOpacity] = useState(255);

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
        <div className="bottom-navbar">
            <div className="bottom-tool-bar">
                <div className="flex gap-7">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pen_stroke_width" style={{fontSize: "13px"}}><b>Pen Stroke Width</b></label>
                        <input type="range" id="pen_stroke_width" name="pen_stroke_width" min="0" max="25" value={inputPenStrokeWidth} onChange={handlePenStrokeWidthChange} style={{cursor: "pointer"}}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="eraser_stroke_width" style={{fontSize: "13px"}}><b>Eraser Stroke Width</b></label>
                        <input type="range" id="eraser_stroke_width" name="eraser_stroke_width" min="0" max="25" value={inputEraserStrokeWidth} onChange={handleEraserStrokeWidthChange} style={{cursor: "pointer"}}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="color_opacity" style={{fontSize: "13px"}}><b>Color Opacity</b></label>
                        <input type="range" id="color_opacity" name="color_opacity" min="0" max="255" value={inputColorOpacity} onChange={handleColorOpacityChange} style={{cursor: "pointer"}}/>
                    </div>
                </div>
                <div className="flex gap-5">
                    <button className="action-btn flex items-center gap-2" onClick={handleUndo}><img src="/undo.png" style={{height: "14px", width: "14px"}}/>Undo</button>
                    <button className="action-btn flex items-center gap-2" onClick={handleRedo}>Redo<img src="/redo.png" style={{height: "14px", width: "14px"}}/></button>                
                </div>
                <div style={{width: "72px"}}>
                    <p style={{fontSize: "13px"}}>{cursorPos.x} * {cursorPos.y}</p>
                </div>
            </div>
        </div>
    );
}