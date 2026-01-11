import { useContext, useEffect, useState, useRef } from "react";
import DrawContext from "../../context/draw/DrawContext";
import CanvasItem from "./CanvasItem";

export default function ViewUndoRedoHistory(props) {

    const undoScrollRef = useRef(null);
    const redoScrollRef = useRef(null);

    const { canvasRef, undoStack, redoStack } = useContext(DrawContext);

    const [currentCanvasStateImage, setCurrentCanvasStateImage] = useState("");
    const [undoYScroll, setUndoYScroll] = useState(false);
    const [redoYScroll, setRedoYScroll] = useState(false);

    const undoScrollToTop = () => {
        undoScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    const redoScrollToTop = () => {
        redoScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const currentCanvasStateImageUrl = canvas.toDataURL("image/jpeg");
        setCurrentCanvasStateImage(currentCanvasStateImageUrl);
        // eslint-disable-next-line
    }, []);    
    
    return (
        <>
            <div className="view-history-modal">
                <div>
                    {
                        undoStack.current.length > 0 ?
                            <>
                                <p className="text-center">undo stack is not empty</p>
                                <p className="text-center"><b>Length: {undoStack.current.length}</b></p><br/>
                                <div ref={undoScrollRef} style={{height: "540px", width: "280px", overflowY: "auto", scrollbarGutter: "stable"}} onScroll={()=>{setUndoYScroll(undoScrollRef.current.scrollTop > 0)}}>
                                    {undoStack.current.map((imageData, index)=>{
                                        return <CanvasItem key={index} imageData={imageData} setShowUndoRedoHistoryModal={props.setShowUndoRedoHistoryModal}/>
                                    }).reverse()}
                                </div>
                            </>
                        :
                            <>
                                <p className="text-center">undo stack is empty</p>
                                <div style={{height: "540px", width: "280px"}}></div>
                            </>
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
                                <div ref={redoScrollRef} style={{height: "540px", width: "280px", overflowY: "auto", scrollbarGutter: "stable"}} onScroll={()=>{setRedoYScroll(redoScrollRef.current.scrollTop > 0)}}>
                                    {redoStack.current.map((imageData, index)=>{
                                        return <CanvasItem key={index} imageData={imageData} setShowUndoRedoHistoryModal={props.setShowUndoRedoHistoryModal}/>
                                    }).reverse()}
                                </div>                            
                            </>
                        :
                            <>
                                <p className="text-center">redo stack is empty</p>
                                <div style={{height: "540px", width: "280px"}}></div>
                            </>            
                    }
                </div>
            </div>
            <button className={`up-scroll-btn${undoYScroll?"-show":""}`} onClick={undoScrollToTop} style={{bottom: "22px", right: "1040px"}}><img src="/up-arrow.png" alt="up arrow icon" style={{height: "14px", width: "14px"}}/></button>
            <button className={`up-scroll-btn${redoYScroll?"-show":""}`} onClick={redoScrollToTop} style={{bottom: "22px", right: "120px"}}><img src="/up-arrow.png" alt="up arrow icon" style={{height: "14px", width: "14px"}}/></button>
        </>
    );
}