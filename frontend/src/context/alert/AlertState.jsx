import { useState } from "react";
import AlertContext from "./AlertContext";

export default function AlertState(props) {

    const [alert, setAlert] = useState(false);
    const [alertColor, setAlertColor] = useState("");
    const [alertType, setAlertType] = useState("");
    const [alertMsg, setAlertMsg] = useState("");

    const showAlert = (type, msg) => {
        setAlert(true);
        setAlertType(type);
        setAlertMsg(msg);

        switch (type) {
            case "Warning":
                setAlertColor("yellow");
                break;
            case "Success":
                setAlertColor("green");
                break;
            case "Error":
                setAlertColor("red");
                break;
            default:
                setAlertColor("white");
                break;
        }

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
                        <div style={{padding: "8px 12px", backgroundColor: `${alertColor}`}}>
                            <h1 style={{fontSize: "14px"}}><b>{alertType}</b></h1>
                        </div>
                        <div style={{padding: "8px 24px", borderLeft: "1px solid black", borderRight: "1px solid black"}}>
                            <p style={{fontSize: "14px"}}>{alertMsg}</p>
                        </div>
                        <div style={{padding: "0px 12px"}}>
                            <img src="close.png" alt="close button image" style={{height: "12px", width: "12px", cursor: "pointer"}} onClick={()=>{setAlert(false)}}/>
                        </div>
                    </div>
                </div>
            }
        </> 
    );
}