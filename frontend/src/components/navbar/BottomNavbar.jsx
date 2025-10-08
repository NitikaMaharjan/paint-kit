import { useContext } from "react"
import DrawContext from "../../context/draw/DrawContext"

export default function BottomNavbar() {
    
    const { handleClearCanvas } = useContext(DrawContext);

    return (
        <div className="bottom-navbar">
            <div className="bottom-tool-bar">
                <button className="confirm-btn" onClick={handleClearCanvas}>clear all</button>
            </div>
        </div>
    )
}
