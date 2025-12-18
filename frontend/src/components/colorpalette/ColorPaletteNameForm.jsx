import { useContext, useEffect, useState } from "react";
import AlertContext from "../../context/alert/AlertContext";

export default function ColorPaletteNameForm(props) {

    const { showAlert } = useContext(AlertContext);

    const [inputValue, setInputValue] = useState({
        color_palette_name: ""
    });
    const [colors, setColors] = useState([]);

    const updateInputValue = (e) => {
        setInputValue({...inputValue, [e.target.name]: e.target.value.trimStart()});
    }

    const clearInput = (input_field) => {
        setInputValue({...inputValue, [input_field]: ""});
        if(input_field==="color_name"){
            removeBorderHighlight("color-name");
        }
    }
    
    const addBorderHighlight = (type) => {
        document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
    }
    
    const removeBorderHighlight = (type) => {
        document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
    }

    const validateInputValue = () => {
        const colorPaletteNameRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;

        let trimmed_color_palette_name = inputValue.color_palette_name.trim();

        if(trimmed_color_palette_name==="" && colors.length!==0){
            showAlert("Warning", "Color palette name is required. Please try again!");
            return false;
        }
        
        if(trimmed_color_palette_name!=="" && colors.length===0){
            showAlert("Warning", "Colors in the color palette cannot be empty. Please try again!");
            return false;
        }
        
        if(trimmed_color_palette_name==="" || colors.length===0){
            showAlert("Warning", "Please enter the input data to create the color palette!");
            return false;
        }
        
        if(!colorPaletteNameRegex.test(trimmed_color_palette_name)){
            showAlert("Warning", "Color palette name can only contain letters, numbers and single consecutive space!");
            return false;
        }
        
        if(trimmed_color_palette_name.length<3){
            showAlert("Warning", "Color palette name must be atleast 3 characters!");
            return false;
        }
        
        if(trimmed_color_palette_name.length>25){
            showAlert("Warning", "Color palette name cannot be more than 25 characters!");
            return false;
        }

        if(colors.length<1){
            showAlert("Warning", "There must be at least 1 color in the color palette!");
            return false;
        }
        return true;
    }

    const handleSaveColorPalette = async(e) => {
        e.preventDefault();
        if(validateInputValue()){
            try{
                const response = await fetch(`http://localhost:5000/api/colorpalette/savecolorpalette`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify({
                        by_admin: localStorage.getItem("adminSignedIn")&&localStorage.getItem("admin_token")?true:false,
                        user_id: localStorage.getItem("adminSignedIn")&&localStorage.getItem("admin_token")?localStorage.getItem("admin_id"):localStorage.getItem("user_id"),
                        color_palette_name: inputValue.color_palette_name.trim(),
                        colors: colors
                    })
                });
                const json = await response.json();
        
                if(json.success){
                    props.setShowColorPaletteNameFormModal(false);
                    if(localStorage.getItem("adminSignedIn")&&localStorage.getItem("admin_token")){
                        props.setShowGenerateColorPaletteModal(false);
                    }
                    showAlert("Success", "Your color palette looks awesome. It has been saved successfully!");
                }else{
                    if(json.error){
                        showAlert("Error", json.error);
                    }          
                    if(json.errors){
                        showAlert("Error", json.errors.map(err => err.msg).join("\n")+"\nPlease try again!");
                    }
                }
            }catch(err){
                showAlert("Error", "Network error. Please check your connection or try again later!")
            }
        }
    }

    useEffect(() => {
      setColors(props.colors);
      // eslint-disable-next-line
    }, []);    

    return (
        <div className="auth-form-box">
            <div className="flex items-center justify-center" style={{borderBottom: "1px solid black", backgroundColor: "#ccc", width: "100%"}}>
                <h1 style={{fontSize: "14px", textAlign: "center", width: "86%", padding: "8px 0px", borderRight: "1px solid black"}}><b>Add color palette name</b></h1>
                <div style={{margin: "0px 5px 0px 10px", cursor: "pointer"}} onClick={()=>{props.setShowColorPaletteNameFormModal(false)}}>
                    <img src="/close.png" alt="close icon" style={{height: "14px", width: "14px"}}/>
                </div>
            </div>
            <form className="auth-form">
                <div style={{marginBottom: "28px"}}>
                    <label htmlFor="color_palette_name"><b>Color palette name</b></label>
                    <div className="input-bar" id="color-palette-input-bar" style={{width: "240px"}}>
                        <input type="text" id="color_palette_name" name="color_palette_name" placeholder="Enter color palette name" value={inputValue.color_palette_name} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("color-palette")}} onBlur={()=>{removeBorderHighlight("color-palette")}}/>
                        <img src="/close.png" alt="close icon" onClick={()=>{clearInput("color_palette_name")}} style={{opacity: `${inputValue.color_palette_name===""?0:1}`}}/>
                    </div>
                </div>
                <button type="submit" className="submit-btn" onClick={handleSaveColorPalette}><b>Save color palette</b></button>
            </form>
        </div>
    );
}