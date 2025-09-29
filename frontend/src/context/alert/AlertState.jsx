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
                        <div className="flex items-center justify-between" style={{padding: "6px 12px", borderBottom: "1px solid black", backgroundColor: `${alertColor}`}}>
                            <div className="flex items-center justify-between gap-2">
                                <img src={alertType+".png"} alt={alertType+" image"} style={{width: `${alertColor==="#ffc107"?"18px":"20px"}`}}/>
                                <h1 style={{paddingTop: "2px", fontSize: "14px", color: `${alertColor==="#ffc107"?"black":"white"}`}}><b>{alertType}</b></h1>
                            </div>
                            <img src={`${alertColor==="#ffc107"?"close.png":"close-white.png"}`} alt="close button image" style={{height: "14px", width: "14px", cursor: "pointer"}} onClick={()=>{setAlert(false)}}/>
                        </div>
                        <p style={{padding: "12px", fontSize: "13px"}}>{alertMsg}</p>
                    </div>
                </div>
            }
        </> 
    );
}