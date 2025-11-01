import { useState, useRef } from "react";
import ConfirmContext from "./ConfirmContext";

export default function ConfirmState(props) {

    const answerRef = useRef(null);

    const [confirm, setConfirm] = useState(false);
    const [confirmMsg, setConfirmMsg] = useState("");

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

    return (
        <>
            <ConfirmContext.Provider value={{ showConfirm }}>
                {props.children}
            </ConfirmContext.Provider>

            {
                confirm                
                &&
                <div className="confirm-modal-background" onClick={handleCancel}>
                    <div className="confirm-modal">
                        <div className="flex items-center" style={{borderBottom: "1px solid black"}}>
                            <h1 style={{margin: "0px 0px 0px 14px", fontSize: "14px", width: "100%", textAlign: "center"}}><b>{confirmMsg}</b></h1>
                            <div style={{padding: "8px", borderLeft: "1px solid black"}}>
                                <img src="/close.png" alt="close button image" style={{height: "12px", width: "12px", cursor: "pointer"}} onClick={handleCancel}/>
                            </div>                           
                        </div>
                        <div style={{padding: "18px"}}>
                            <p style={{marginBottom: "18px", textAlign: "center", fontSize: "14px"}}>Are you sure?</p>
                            <div className="flex justify-around">
                                <button className="confirm-btn" onClick={handleOk}>Yes</button>
                                <button className="confirm-btn" onClick={handleCancel}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </> 
    );
}