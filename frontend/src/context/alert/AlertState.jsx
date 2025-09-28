import { useState } from "react";
import AlertContext from "./AlertContext";

export default function AlertState(props) {

    const [alert, setAlert] = useState(false);
    const [alertColor, setAlertColor] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertMsg, setAlertMsg] = useState("");

    const showAlert = (color, type, msg) => {
        setAlert(true);
        setAlertColor(color);
        setAlertType(type);
        setAlertMsg(msg);

        setTimeout(() => {
            setAlert(false);
        }, 2000);
    }

    return(
        <>
            <AlertContext.Provider value={{showAlert}}>
                {props.children}
            </AlertContext.Provider>

            {
                alert 
                
                &&

                <div className="alert-modal-background">
                    <div className="alert-modal">
                        <div className="flex items-center justify-between" style={{padding: "8px 18px 8px 18px", borderBottom: "1px solid black", backgroundColor: `${alertColor}`}}>
                            <h1 style={{fontSize: "14px"}}><b>{alertType}</b></h1>
                            <img src="close.png" alt="close button image" style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{setAlert(false)}}/>
                        </div>
                        <p style={{padding: "18px", fontSize: "13px"}}>{alertMsg}</p>
                    </div>
                </div>
            }
        </>
    );
}