import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import ChangePasswordForm from "../ChangePasswordForm";

export default function AdminTopNavbar() {

    let navigate = useNavigate();

    const { showAlert } = useContext(AlertContext);
    const { showConfirm } = useContext(ConfirmContext);
    
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

    const handleSignOut = async() => {
        let ans = await showConfirm("Sign out");
        if(ans){
            localStorage.removeItem("adminSignedIn");
            localStorage.removeItem("adminAuthToken");
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_id");
            localStorage.removeItem("admin_email");
            localStorage.removeItem("admin_username");
            localStorage.removeItem("adminContentChoice");
            navigate("/adminsignin");
            showAlert("Success", "You've signed out. See you next time!");
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line
    }, []);
    
    return (
        <>
            <div className="flex items-center justify-between" style={{margin: "20px 0px 0px 340px", height: "40px", width: "980px", position: "fixed", top: "0"}}>
                <h1 style={{fontSize: "14px"}}><b><b>{getDate()} | {getTime()}</b></b></h1>
                <div className="flex items-center">
                    <div className="flex items-center justify-center" style={{border: "1px solid rgba(0, 0, 0, 0.8)", height: "19px", width: "19px", borderRadius: "18px"}}>
                        <img src="/user.png" alt="user icon" style={{height: "13px", width: "13px"}}/>
                    </div>&nbsp;
                    <p style={{fontSize: "13px"}}>{localStorage.getItem("admin_username")}</p>&nbsp;
                    <p style={{fontSize: "13px"}}><b>|</b> {localStorage.getItem("admin_email")}</p>&nbsp;
                    <div>
                        <div id="arrow" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{padding: "4px"}}>
                            <button className="dropdown-btn" onClick={()=>{setShowSettingDropDown(true)}}><img src="/down-arrow.png" alt="down arrow icon" style={{height: "14px", width: "14px"}}/></button>
                        </div>
                        {
                            showSettingDropDown
                            &&
                            <div className="dropdown-content-background" style={{justifyContent: "end", padding: "55px 45px 0px 0px"}} onClick={()=>{setShowSettingDropDown(false)}}>
                                <div className="dropdown-content">
                                    <button className="dropdown-content-button" onClick={()=>{setShowSettingDropDown(false); setShowChangePasswordFormModal(true);}}>Change password</button>
                                    <button className="dropdown-content-button" onClick={()=>{setShowSettingDropDown(false); handleSignOut();}}>Sign out</button>
                                </div>
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