import { useContext, useEffect, useState } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function BottomNavbar(props) {
    
    const { handleUndo, handleRedo, setPenStrokeWidth, setEraserStrokeWidth, setColorOpacity } = useContext(DrawContext);

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
                <div className="flex items-center justify-between p-2">
                    <label htmlFor="pen_stroke_width">Pen Stroke Width:</label>
                    <input type="range" id="pen_stroke_width" name="pen_stroke_width" min="0" max="25" value={inputPenStrokeWidth} onChange={handlePenStrokeWidthChange} style={{color: "black"}}/>
                    
                    <label htmlFor="eraser_stroke_width">Eraser Stroke Width:</label>
                    <input type="range" id="eraser_stroke_width" name="eraser_stroke_width" min="0" max="25" value={inputEraserStrokeWidth} onChange={handleEraserStrokeWidthChange}/>
                    
                    <label htmlFor="color_opacity">Color Opacity:</label>
                    <input type="range" id="color_opacity" name="color_opacity" min="0" max="255" value={inputColorOpacity} onChange={handleColorOpacityChange}/>
                </div>
                <div className="flex justify-end pr-4 gap-4">
                    <button className="action-btn flex items-center gap-2" onClick={handleUndo}><img src="/undo.png" style={{height: "14px", width: "14px"}}/>Undo</button>
                    <button className="action-btn flex items-center gap-2" onClick={handleRedo}>Redo<img src="/redo.png" style={{height: "14px", width: "14px"}}/></button>
                </div>
            </div>
        </div>
    );
}