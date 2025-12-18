import { useEffect, useState } from "react";
import ChangePasswordForm from "../ChangePasswordForm";

export default function TopNavbar(props) {
    
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [showSettingDropDown, setShowSettingDropDown] = useState(false);
    const [showChangePasswordFormModal, setShowChangePasswordFormModal] = useState(false);
    
    const handleMouseOver = () => {
        document.getElementById("arrow").style.backgroundColor="rgba(0, 0, 0, 0.05)";
    }
    
    const handleMouseOut = () => {
        document.getElementById("arrow").style.backgroundColor="transparent";
    }

    const getDate = () => {
        return currentDateTime.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    }
    
    const getTime = () => {
        return currentDateTime.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
    return (
        <>
            <div className="flex items-center justify-between" style={{margin: "20px 0px 0px 340px", height: "40px", width: "980px", position: "fixed", top: "0"}}>
                <h1 style={{fontSize: "14px"}}><b><b>{getDate()} | {getTime()}</b></b></h1>
                <div className="flex items-center">
                    <div className="flex items-center justify-center" style={{border: "1px solid rgba(0, 0, 0, 0.8)", height: "19px", width: "19px", borderRadius: "18px"}}>
                        <img src="/user.png" alt="user icon" style={{height: "13px", width: "13px"}}/>
                    </div>&nbsp;
                    <p style={{fontSize: "13px"}}>{props.username}</p>&nbsp;
                    <p style={{fontSize: "13px"}}><b>|</b> {props.email}</p>&nbsp;
                    <div>
                        <div id="arrow" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{padding: "4px"}}>
                            <button className="dropdown-btn" onClick={()=>{setShowSettingDropDown(!showSettingDropDown)}}><img src="/down-arrow.png" alt="down arrow icon" style={{height: "14px", width: "14px"}}/></button>
                        </div>
                        {
                            showSettingDropDown
                            &&
                            <div className="dropdown-content">
                                <button className="dropdown-content-button" onClick={()=>{setShowChangePasswordFormModal(true);setShowSettingDropDown(!showSettingDropDown);}}>Change password</button>
                                <button className="dropdown-content-button" onClick={()=>{props.handleSignOut();setShowSettingDropDown(!showSettingDropDown);}}>Sign out</button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {
                showChangePasswordFormModal
                &&
                <div className="confirm-modal-background">
                    <ChangePasswordForm setShowChangePasswordFormModal={setShowChangePasswordFormModal}/>
                </div>
            }
        </>
    );
}