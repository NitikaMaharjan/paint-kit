import { useState, useRef } from "react";
import ConfirmContext from "./ConfirmContext";

export default function ConfirmState(props) {

    const [confirm, setConfirm] = useState(false);
    const [confirmMsg, setConfirmMsg] = useState("");
    const answerRef = useRef(null);

    const showConfirm = (msg) => {
        setConfirm(true);
        setConfirmMsg(msg);
        return new Promise((resolve) => {
            answerRef.current = resolve; // store resolve function in answerRef.current
        });
    }

    const handleOk = () => {
        if (answerRef.current!==null){
            answerRef.current(true);
        }
        setConfirm(false);
    }

    const handleCancel = () => {
        if (answerRef.current!==null){
            answerRef.current(false);
        }
        setConfirm(false);
    }

    return(
        <>
            <ConfirmContext.Provider value={{showConfirm}}>
                {props.children}
            </ConfirmContext.Provider>

            {
                confirm 
                
                &&

                <div className="confirm-modal-background" onClick={handleCancel}>
                    <div className="confirm-modal">
                        <div className="flex items-center justify-between" style={{borderBottom: "1px solid black", backgroundColor: "#ccc"}}>
                            <div className="flex items-center justify-between gap-2" style={{padding: "0px 0px 0px 8px"}}>
                                <h1 style={{fontSize: "14px"}}><b>{confirmMsg}</b></h1>
                            </div>
                            <div style={{borderLeft: "1px solid black"}}>
                                <div style={{padding: "6px"}}>
                                    <img src="close.png" alt="close button image" style={{height: "13px", width: "13px", cursor: "pointer"}} onClick={handleCancel}/>
                                </div>
                            </div>                             
                        </div>
                        <div style={{padding: "18px"}}>
                            <p style={{marginBottom: "12px", textAlign: "center", fontSize: "13px"}}>Are you sure?</p>
                            <div className="flex justify-around">
                                <button className="confirm-btn" onClick={handleOk}>Ok</button>
                                <button className="confirm-btn" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </> 
    );
}