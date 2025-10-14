import { useContext, useEffect, useState } from "react"
import DrawContext from "../../context/draw/DrawContext"

export default function BottomNavbar() {
    
    const { handleClearCanvas, handleUndo, handleRedo, setPenStrokeWidth, setEraserStrokeWidth, setColorOpacity } = useContext(DrawContext);

    const [inputPenStrokeWidth, setInputPenStrokeWidth] = useState(2);
    const [inputEraserStrokeWidth, setInputEraserStrokeWidth] = useState(4);
    const [inputColorOpacity, setInputColorOpacity] = useState(255);

    const handlePenStrokeWidthChange = (e)=> {
        setInputPenStrokeWidth(e.target.value);
    }
    
    const handleEraserStrokeWidthChange = (e)=> {
        setInputEraserStrokeWidth(e.target.value);
    }
    
    const handleColorOpacityChange = (e)=> {
        setInputColorOpacity(e.target.value);
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
                <button className="confirm-btn" onClick={handleClearCanvas}>clear all</button>
                <button className="confirm-btn" onClick={handleUndo}>Undo</button>
                <button className="confirm-btn" onClick={handleRedo}>Redo</button>
                <label htmlFor="pen_stroke_width">Pen Stroke Width:</label>
                <input type="range" id="pen_stroke_width" name="pen_stroke_width" min="0" max="25" value={inputPenStrokeWidth} onChange={handlePenStrokeWidthChange}/>
                <label htmlFor="eraser_stroke_width">Eraser Stroke Width:</label>
                <input type="range" id="eraser_stroke_width" name="eraser_stroke_width" min="0" max="25" value={inputEraserStrokeWidth} onChange={handleEraserStrokeWidthChange}/>
                <label htmlFor="color_opacity">Color Opacity:</label>
                <input type="range" id="color_opacity" name="color_opacity" min="0" max="255" value={inputColorOpacity} onChange={handleColorOpacityChange}/>
            </div>
        </div>
    )
}
