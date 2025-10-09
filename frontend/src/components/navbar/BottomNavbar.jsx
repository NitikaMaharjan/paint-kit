import { useContext } from "react"
import DrawContext from "../../context/draw/DrawContext"

export default function BottomNavbar() {
    
    const { handleClearCanvas, handleUndo, handleRedo } = useContext(DrawContext);

    return (
        <div className="bottom-navbar">
            <div className="bottom-tool-bar">
                <button className="confirm-btn" onClick={handleClearCanvas}>clear all</button>
                <button className="confirm-btn" onClick={handleUndo}>Undo</button>
                <button className="confirm-btn" onClick={handleRedo}>Redo</button>
            </div>
        </div>
    )
}
