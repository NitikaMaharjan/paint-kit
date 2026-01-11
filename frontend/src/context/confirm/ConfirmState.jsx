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
        if(answerRef.current!==null){
            answerRef.current(true);
        }
        setConfirm(false);
    }

    const handleCancel = () => {
        if(answerRef.current!==null){
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
                        <div className="flex items-center justify-center" style={{borderBottom: "1px solid black", backgroundColor: "#ccc", width: "100%"}}>
                            <h1 style={{fontSize: "14px", textAlign: "center", width: "86%", padding: "8px 0px", borderRight: "1px solid black"}}><b>{confirmMsg}</b></h1>
                            <div style={{margin: "0px 5px 0px 10px", cursor: "pointer"}}>
                                <img src="/close.png" alt="close icon" style={{height: "14px", width: "14px"}} onClick={handleCancel}/>
                            </div>
                        </div>
                        <div style={{padding: "18px"}}>
                            <p style={{marginBottom: "18px", textAlign: "center", fontSize: "14px"}}>Are you sure?</p>
                            <div className="flex justify-around">
                                <button className="confirm-button" onClick={handleOk}>Yes</button>
                                <button className="confirm-button" onClick={handleCancel}>No</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </> 
    );
}