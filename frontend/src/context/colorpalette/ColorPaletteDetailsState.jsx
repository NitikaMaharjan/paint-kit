import { useContext, useState } from "react";
import ColorPaletteDetailsContext from "./ColorPaletteDetailsContext";
import AlertContext from "../alert/AlertContext";

export default function ColorPaletteDetailsState(props) {

    const { showAlert } = useContext(AlertContext);

    const [colorPaletteDetails, setColorPaletteDetails] = useState([]);
    
    const userFetchColorPalette = async()=>{
        try{
            const response = await fetch(`http://localhost:5000/api/colorpalette/userfetchcolorpalette?user_id=${localStorage.getItem("user_id")}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const json = await response.json();

            if(json.success){
                setColorPaletteDetails(json.colorPaletteDetails);
            }else{
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!")
        }
    }
    
    const adminFetchColorPalette = async()=>{
        try{
            const response = await fetch(`http://localhost:5000/api/colorpalette/adminfetchcolorpalette`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const json = await response.json();

            if(json.success){
                setColorPaletteDetails(json.colorPaletteDetails);
            }else{
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!")
        }
    }

    return(
        <ColorPaletteDetailsContext.Provider value={{ colorPaletteDetails, userFetchColorPalette, adminFetchColorPalette }}>
            {props.children}
        </ColorPaletteDetailsContext.Provider>
    );
}