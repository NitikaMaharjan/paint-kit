import { useContext, useState } from "react";
import DrawContext from "../../context/draw/DrawContext";
import ViewUndoRedoHistory from "../draw/ViewUndoRedoHistory";

export default function UserTopNavbar(props) {

    const { handleClearCanvas } = useContext(DrawContext);

    const [showUndoRedoHistoryModal, setShowUndoRedoHistoryModal] = useState(false);

    return (
        <>
            <div>
                <button className="action-btn" onClick={()=>{if(props.checkUserSignedIn()){setShowUndoRedoHistoryModal(true)}}}>View Undo/Redo History</button>
                <button className="action-btn" onClick={handleClearCanvas}>clear all</button>
            </div>
            {
                showUndoRedoHistoryModal
                &&
                <div className="view-history-modal-background">
                    <div style={{position: "fixed", top: "30px", right: "30px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowUndoRedoHistoryModal(false)}}>
                        <img src="/close-white.png" alt="close icon" style={{height: "18px", width: "18px"}}/>
                    </div>
                    <ViewUndoRedoHistory setShowUndoRedoHistoryModal={setShowUndoRedoHistoryModal}/>
                </div>
            }
        </>
    );
}