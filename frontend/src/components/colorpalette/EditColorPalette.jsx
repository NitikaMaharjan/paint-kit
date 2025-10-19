import { useContext, useState, useRef } from "react";
import AlertContext from "../../context/alert/AlertContext";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";

export default function UserEditColorPalette(props) {

    const { showAlert } = useContext(AlertContext);
    const { userFetchUserColorPalette, adminFetchColorPalette  } = useContext(ColorPaletteDetailsContext);

    const [inputValue, setInputValue] = useState({
        color_palette_name: props.selectedColorPalette.color_palette_name,
        color_name: ""
    });
    const [colors, setColors] = useState(props.selectedColorPalette.colors);

    const pickAColor = useRef(null);    

    const updateInputValue = (e) => {
        setInputValue({...inputValue, [e.target.name]: e.target.value.trimStart()});
    }

    const clearInput = (input_field) => {
        setInputValue({...inputValue, [input_field]: ""});
        if (input_field==="color_name"){
            removeBorderHighlight("color-name");
        }
    }

    const addColor = (e) => {
        e.preventDefault();
        if (inputValue.color_name===""){
            removeBorderHighlight("color-name");
            return;
        }

        if (colors.includes(inputValue.color_name)){
            showAlert("Warning", inputValue.color_name+" color has already been added to the color palette!");
            removeBorderHighlight("color-name");
            return;
        }

        if (colors.length<12){
            setColors([...colors, inputValue.color_name]);
            setInputValue({...inputValue, ["color_name"]: ""});
            removeBorderHighlight("color-name");
        }else{
            removeBorderHighlight("color-name");
            showAlert("Warning", "A color palette can contain maximum of only 12 colors!");
        }
    }
    
    const removeColor = (colorToRemove) => {
        setColors(prevColors => prevColors.filter(color => color !== colorToRemove));
    }

    const addBorderHighlight = (type)=> {
        document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
    }
    
    const removeBorderHighlight = (type)=> {
        document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
    }

    const calculateBrightness = (hexColor)=> {
        let color_without_hash = hexColor.replace("#", "");

        const r = parseInt(color_without_hash.substring(0, 2), 16);
        const g = parseInt(color_without_hash.substring(2, 4), 16);
        const b = parseInt(color_without_hash.substring(4, 6), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness>128?"/close.png":"/close-white.png";
    }

    const validateInputValue = ()=> {
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
        
        if (trimmed_color_palette_name==="" || colors.length===0){
            showAlert("Warning", "Please enter the input data to create the color palette!");
            return false;
        }
        
        if (!colorPaletteNameRegex.test(trimmed_color_palette_name)){
            showAlert("Warning", "Color palette name can only contain letters, numbers and single consecutive space!");
            return false;
        }
        
        if (trimmed_color_palette_name.length<3){
            showAlert("Warning", "Color palette name must be atleast 3 characters!");
            return false;
        }
        
        if (trimmed_color_palette_name.length>25){
            showAlert("Warning", "Color palette name cannot be more than 25 characters!");
            return false;
        }

        if (colors.length<1){
            showAlert("Warning", "There must be at least 1 color in the color palette!");
            return false;
        }

        return true;
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(validateInputValue()){
            try{
                const response = await fetch(`http://localhost:5000/api/colorpalette/colorpalette/editcolorpalette/${props.selectedColorPalette.color_palette_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                            color_palette_name: inputValue.color_palette_name.trim(),
                            colors: colors
                        })
                });
                const json = await response.json();
        
                if(json.success){
                    if (localStorage.getItem("adminSignedIn")){
                        await adminFetchColorPalette();
                    }else{
                        await userFetchUserColorPalette();
                    }
                    props.setShowEditColorPaletteModal(false);
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

    return (
        <>
            <div className="auth-form-box">
                <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Edit color palette</b></h1>
                <form className="auth-form">
                    <div className="mb-1">
                        <label htmlFor="color_palette_name"><b>Color palette name</b></label>
                        <div className="input-bar" id="color-palette-input-bar" style={{width: "240px"}}>
                            <input type="text" id="color_palette_name" name="color_palette_name" placeholder="Enter color palette name" value={inputValue.color_palette_name} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("color-palette")}} onBlur={()=>{removeBorderHighlight("color-palette")}}/>
                            <img src="/close.png" alt="close button image" onClick={() => {clearInput("color_palette_name")}} style={{opacity: `${inputValue.color_palette_name===""?0:1}`}}/>
                        </div>
                    </div>
                    <div style={{marginBottom: "28px"}}>
                        <label htmlFor="color_name"><b>Pick colors</b></label>
                        <div className="flex gap-3">
                            <div className="input-bar" id="color-name-input-bar" style={{height: "25.5px", width: "200px", gap: "8px"}}>
                                <input type="color" id="color_name" name="color_name" ref={pickAColor} value={inputValue.color_name} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("color-name")}} onBlur={()=>{removeBorderHighlight("color-name")}} style={{height: "20px", width: "30px", cursor: "pointer"}}/>
                                <p onClick={()=>{addBorderHighlight("color-name");pickAColor.current?.click();}} style={{fontSize: "13px", width: "100%", color: `${inputValue.color_name===""?"#5b5c60":"black"}`, cursor: "pointer"}}>{inputValue.color_name===""?"Pick a color":inputValue.color_name}</p>
                                <img src="/close.png" alt="close button image" onClick={() => {clearInput("color_name")}} style={{opacity: `${inputValue.color_name===""?0:1}`}}/>
                            </div>
                            <button className="add-color-btn" onClick={addColor}>+</button>
                        </div>
                    </div>
                    <button type="submit" className="submit-btn" onClick={handleSubmit}><b>Update color palette</b></button>
                </form>
            </div>
            <div className="auth-form-box">
                <div className="flex items-center justify-between" style={{padding: "8px 0px", height: "38px", borderBottom: "1px solid black", backgroundColor: "#ccc"}}>
                    <h1 style={{fontSize: "14px", marginLeft: "14px"}}><b>{inputValue.color_palette_name}</b></h1>
                    <img src="/close.png" title="close all button" style={{height: "13px", width: "13px", cursor: "pointer", marginRight: "14px", opacity: `${colors.length>1?"1":"0"}`}} onClick={()=>{setColors([])}}/>
                </div>
                <div style={{height: "448px", width: "304px", padding: "12px"}}>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyItems: "center", gap: "12px"}}>
                        {
                            colors.map((a_color, index)=>{
                                return  <div key={index} style={{height: "100px", width: "85px", border: "1px solid black"}}>
                                            <div style={{display: "flex", justifyContent: "right", padding: "4px", height:"78px", backgroundColor: `${a_color}`}} title={`${a_color}`}>
                                                <img src={calculateBrightness(a_color)} alt="close button image" title="close button" style={{height: "12px", width: "12px", cursor: "pointer"}} onClick={() => {removeColor(`${a_color}`)}}/>
                                            </div>
                                            <p style={{padding: "0px 4px", fontSize: "12px", height: "20px", backgroundColor: "white"}}>{a_color}</p>
                                        </div>
                            }).reverse()
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
