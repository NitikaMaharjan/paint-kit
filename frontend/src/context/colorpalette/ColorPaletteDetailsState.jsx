import { useContext, useState } from "react";
import ColorPaletteDetailsContext from "./ColorPaletteDetailsContext";
import AlertContext from "../alert/AlertContext";

export default function ColorPaletteDetailsState(props) {

    const { showAlert } = useContext(AlertContext);

    const [userColorPaletteDetails, setUserColorPaletteDetails] = useState([]);
    const [adminColorPaletteDetails, setAdminColorPaletteDetails] = useState([]);
    
    const userFetchUserColorPalette = async()=>{
        try{
            const response = await fetch(`http://localhost:5000/api/colorpalette/colorpalette/userfetchcolorpalette?user_id=${localStorage.getItem("user_id")}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
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
    
    const adminFetchColorPalette = async()=>{
        try{
            const response = await fetch(`http://localhost:5000/api/colorpalette/colorpalette/adminfetchcolorpalette`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
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

    return(
        <ColorPaletteDetailsContext.Provider value={{ userColorPaletteDetails, userFetchUserColorPalette, adminColorPaletteDetails, adminFetchColorPalette }}>
            {props.children}
        </ColorPaletteDetailsContext.Provider>
    );
}