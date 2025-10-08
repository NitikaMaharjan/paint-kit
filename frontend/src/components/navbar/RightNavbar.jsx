import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import CreateColorPalette from "../colorpalette/CreateColorPalette";
import UserViewColorPalette from "../user/UserViewColorPalette";

export default function RightNavbar() {

    let navigate = useNavigate();

    const { showAlert } = useContext(AlertContext);
    const { showConfirm } = useContext(ConfirmContext);

    const [showDropDown, setShowDropDown] = useState(false);
    const [showCreateColorPaletteModal, setShowCreateColorPaletteModal] = useState(false);

    const handleSignOut = async()=> {
        let ans = await showConfirm("Sign out");
        if (ans) {
        localStorage.removeItem("userSignedIn");
        localStorage.removeItem("userAuthToken");
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_username");
        navigate("/usersignin");
        showAlert("Success", "You've signed out. See you next time!");
        }
    }

    const handleCapitalizeFirstLetter = (text) => {
        let words = text.split(' ');
        for (let i=0; i<words.length; i++){
            words[i] = words[i].charAt(0).toUpperCase()+words[i].substring(1).toLowerCase();
        }
        text = (words.join(' '));
        return text.length>18?text.slice(0,18)+"...":text;
    }

    const handleMouseOver= ()=> {
        document.getElementById("user-info").style.backgroundColor="rgba(0, 0, 0, 0.1)";
    }
    
    const handleMouseOut= ()=> {
        document.getElementById("user-info").style.backgroundColor="transparent";
    }

    return (
        <>
            <div className="right-navbar">
                <div id="user-info" className="flex items-center justify-between p-2" style={{borderRadius: "3px"}}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center" style={{border: "1px solid black", height: "24px", width: "24px", borderRadius: "24px"}}>
                            <img src="user.png" style={{height: "18px", width: "18px"}}/>
                        </div>
                        <div style={{lineHeight: "18px"}}>
                            <p style={{fontSize: "14px"}} title={localStorage.getItem("user_username")}><b>{handleCapitalizeFirstLetter(localStorage.getItem("user_username")?localStorage.getItem("user_username"):"")}</b></p>
                            <p style={{fontSize: "13px", color: "rgba(0, 0, 0, 0.7)"}} title={localStorage.getItem("user_email")}>{localStorage.getItem("user_email")?localStorage.getItem("user_email").length>20?localStorage.getItem("user_email").slice(0,20)+"...":localStorage.getItem("user_email"):""}</p>
                        </div>
                    </div>
                    <div>
                        <button className="dropdown-btn" onClick={()=>{setShowDropDown(!showDropDown)}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><img src="down-arrow.png" style={{height: "14px", width: "14px"}}/></button>
                        {
                            showDropDown
                            &&
                            <div className="dropdown-content">
                                <button className="dropdown-content-button">Settings</button>
                                <button className="dropdown-content-button" onClick={handleSignOut}>Sign out</button>
                            </div>
                        }
                    </div>
                </div>
                <UserViewColorPalette/>
                <button onClick={()=>{setShowCreateColorPaletteModal(true)}} className="confirm-btn" style={{position: "fixed", bottom: "20px", right: "48px", width: "200px"}}>Create Color Palette</button>
            </div>
            {
                showCreateColorPaletteModal
                &&
                <div className="confirm-modal-background">
                    <div className="flex items-center pt-8 gap-10">
                        <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowCreateColorPaletteModal(false)}}>
                            <img src="close-white.png" style={{height: "18px", width: "18px"}}/>
                        </div>
                        <CreateColorPalette setShowCreateColorPaletteModal={setShowCreateColorPaletteModal}/>
                    </div>
                </div>
            }
        </>
    )
}
