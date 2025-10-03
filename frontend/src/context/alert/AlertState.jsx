import { useState } from "react";
import AlertContext from "./AlertContext";

export default function AlertState(props) {

    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMsg, setAlertMsg] = useState("");

    const showAlert = (type, msg) => {
        setAlert(true);
        setAlertType(type);
        setAlertMsg(msg);

        setTimeout(() => {
            setAlert(false);
        }, 3000);
    }

    return(
        <>
            <AlertContext.Provider value={{showAlert}}>
                {props.children}
            </AlertContext.Provider>

            {
                alert 
                
                &&

                <div className="alert-modal-background" onClick={()=>{setAlert(false)}}>
                    <div className="alert-modal">
                        <div className="flex items-center gap-2" style={{padding: "6px 12px", borderRight: "1px solid black"}}>
                            <img src={`${alertType}.png`} alt={`${alertType}`+" image"} style={{height: "24px", width: "24px"}}/>
                            <p style={{fontSize: "14px"}}>{alertMsg}</p>
                        </div>
                        <div style={{padding: "13px"}}>
                            <img src="close.png" alt="close button image" style={{height: "12px", width: "12px", cursor: "pointer"}} onClick={()=>{setAlert(false)}}/>
                        </div>
                    </div>
                </div>
            }
        </> 
    );
}