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

                <div className="alert-modal-background" onClick={()=>{setAlert(false)}}>
                    <div className="alert-modal">
                        <div className="flex items-center justify-between" style={{borderBottom: "1px solid black", backgroundColor: `${alertColor}`}}>
                            <div className="flex items-center justify-between gap-2" style={{padding: "0px 0px 0px 8px"}}>
                                <img src={alertType+".png"} alt={alertType+" image"} style={{width: "18px"}}/>
                                <h1 style={{paddingTop: "2px", fontSize: "13px", color: "black"}}><b>{alertType}</b></h1>
                            </div>
                            <div style={{borderLeft: "1px solid black"}}>
                                <div style={{padding: "6px"}}>
                                    <img src="close.png" alt="close button image" style={{height: "13px", width: "13px", cursor: "pointer"}} onClick={()=>{setAlert(false)}}/>
                                </div>
                            </div>
                        </div>
                        <p style={{padding: "8px", fontSize: "13px"}}>{alertMsg}</p>
                    </div>
                </div>
            }
        </> 
    );
}