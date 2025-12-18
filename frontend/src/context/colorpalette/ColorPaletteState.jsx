import { useContext, useState } from "react";
import AlertContext from "../alert/AlertContext";
import ConfirmContext from "../confirm/ConfirmContext";
import ColorPaletteContext from "./ColorPaletteContext";

export default function ColorPaletteState(props) {

    const { showAlert } = useContext(AlertContext);
    const { showConfirm } = useContext(ConfirmContext);

    const [userColorPalettes, setUserColorPalettes] = useState([]);
    const [adminColorPalettes, setAdminColorPalettes] = useState([]);
    
    const fetchUserColorPalette = async() => {
        try{
            const response = await fetch(`http://localhost:5000/api/colorpalette/fetchusercolorpalette?user_id=${localStorage.getItem("user_id")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();

            if(json.success){
                setUserColorPalettes(json.fetchedUserColorPalette);
            }else{
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!")
        }
    }
    
    const fetchAdminColorPalette = async() => {
        try{
            const response = await fetch(`http://localhost:5000/api/colorpalette/fetchadmincolorpalette`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();

            if(json.success){
                setAdminColorPalettes(json.fetchedAdminColorPalette);
            }else{
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!")
        }
    }

    const handleDeleteColorPalette = async(palette_id) => {
        let ans = await showConfirm("Delete color palette");
        if(ans){
            try{
                const response = await fetch(`http://localhost:5000/api/colorpalette/deletecolorpalette`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "_id": palette_id
                    }
                });
                const json = await response.json();

                if(json.success){
                    showAlert("Success", "Your color palette has been deleted successfully!");
                    if(localStorage.getItem("adminSignedIn")&&localStorage.getItem("admin_token")){
                        await fetchAdminColorPalette();
                    }else{
                        await fetchUserColorPalette();
                    }
                }else{
                    showAlert("Error", json.error);
                }
            }catch(err){
                showAlert("Error", "Network error. Please check your connection or try again later!");
            }
        }
    }

    return (
        <ColorPaletteContext.Provider value={{ userColorPalettes, fetchUserColorPalette, adminColorPalettes, fetchAdminColorPalette, handleDeleteColorPalette }}>
            {props.children}
        </ColorPaletteContext.Provider>
    );
}