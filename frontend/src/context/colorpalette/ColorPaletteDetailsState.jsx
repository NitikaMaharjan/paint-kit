import { useContext, useState } from "react";
import AlertContext from "../alert/AlertContext";
import ConfirmContext from "../confirm/ConfirmContext";
import ColorPaletteDetailsContext from "./ColorPaletteDetailsContext";

export default function ColorPaletteDetailsState(props) {

    const { showAlert } = useContext(AlertContext);
    const { showConfirm } = useContext(ConfirmContext);

    const [userColorPaletteDetails, setUserColorPaletteDetails] = useState([]);
    const [adminColorPaletteDetails, setAdminColorPaletteDetails] = useState([]);
    
    const userFetchUserColorPalette = async() => {
        try{
            const response = await fetch(`http://localhost:5000/api/colorpalette/fetchusercolorpalette?user_id=${localStorage.getItem("user_id")}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();

            if(json.success){
                setUserColorPaletteDetails(json.colorPaletteDetails);
            }else{
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!")
        }
    }
    
    const adminFetchColorPalette = async() => {
        try{
            const response = await fetch(`http://localhost:5000/api/colorpalette/fetchadmincolorpalette`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();

            if(json.success){
                setAdminColorPaletteDetails(json.colorPaletteDetails);
            }else{
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!")
        }
    }

    const handleDeleteColorPalette = async(id) => {
        let ans = await showConfirm("Delete color palette");
        if(ans){
            try{
                const response = await fetch(`http://localhost:5000/api/colorpalette/deletecolorpalette`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "_id": id
                    }
                });
                const json = await response.json();

                if(json.success){
                    showAlert("Success", "Your color palette has been deleted successfully!");
                    if(localStorage.getItem("adminSignedIn")){
                        await adminFetchColorPalette();
                    }else{
                        await userFetchUserColorPalette();
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
        <ColorPaletteDetailsContext.Provider value={{ userColorPaletteDetails, userFetchUserColorPalette, adminColorPaletteDetails, adminFetchColorPalette, handleDeleteColorPalette }}>
            {props.children}
        </ColorPaletteDetailsContext.Provider>
    );
}