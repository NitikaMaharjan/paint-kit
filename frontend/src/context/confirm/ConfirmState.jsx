import { useState, useRef } from "react";
import ConfirmContext from "./ConfirmContext";

export default function ConfirmState(props) {

    const [confirm, setConfirm] = useState(false);
    const answerRef = useRef(null);

    const showConfirm = () => {
        setConfirm(true);
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

                <div className="confirm-modal-background">
                    <div className="confirm-modal">
                        <h1>Are you sure?</h1>
                        <button onClick={handleOk}>Ok</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            }
        </> 
    );
}