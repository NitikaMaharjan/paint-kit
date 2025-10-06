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
        return text;
    }

    return (
        <>
            <div className="right-navbar">
                <div className="flex items-center justify-between">
                    <div style={{lineHeight: "18px"}}>
                        <p style={{fontSize: "16px"}}><b>{handleCapitalizeFirstLetter(localStorage.getItem("user_username")?localStorage.getItem("user_username"):"")}</b></p>
                        <p style={{fontSize: "14px", color: "rgba(0, 0, 0, 0.7)"}}>{localStorage.getItem("user_email")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="profile-picture.jpg" style={{height: "32px", width: "32.5px"}}/>
                        <img src="down-arrow.png" style={{height: "14px", width: "14px", cursor: "pointer"}}/>
                    </div>
                </div>
                <button className="signout-btn mb-1" onClick={handleSignOut}><b>Sign out</b></button>
                <button onClick={()=>{setShowCreateColorPaletteModal(true)}} className="add-color-btn mb-1">Create Color Palette</button>
                <UserViewColorPalette/>
            </div>
            {
                showCreateColorPaletteModal
                &&
                <div className="alert-modal-background">
                    <div className="flex items-center pt-8 gap-10">
                        <div style={{position: "fixed", top: "32px", right: "300px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowCreateColorPaletteModal(false)}}>
                            <img src="close-white.png" style={{height: "18px", width: "18px"}}/>
                        </div>
                        <CreateColorPalette setShowCreateColorPaletteModal={setShowCreateColorPaletteModal}/>
                    </div>
                </div>
            }
        </>
    )
}
