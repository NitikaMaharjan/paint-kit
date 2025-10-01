import { useContext, useState } from "react";
import AlertContext from "../context/alert/AlertContext";

export default function CreateColorPalette() {

    const { showAlert } = useContext(AlertContext);

    const [inputValue, setInputValue] = useState({
        color_palette_name: "",
        color_name: ""
    });
    const [colors, setColors] = useState([]);

    const updateInputValue = (e) => {
        setInputValue({...inputValue, [e.target.name]: e.target.value});
    }

    const clearInput = (input_field) => {
        setInputValue({...inputValue, [input_field]: ""});
    }

    const addColor = (e) => {
        e.preventDefault();
        if (inputValue.color_name===""){
            return;
        }

        if (colors.length<12){
            setColors([...colors, inputValue.color_name]);
            setInputValue({...inputValue, ["color_name"]: ""});
        }else{
            showAlert("Warning", "A color palette can contain maximum of 12 colors!");
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

    return (
        <div className="content gap-10">
            <div className="auth-form-box">
                <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Create color palette</b></h1>
                <div className="flex">
                    <form className="auth-form">
                        <div className="mb-1">
                            <label htmlFor="color_palette_name"><b>Color palette name</b></label>
                            <div className="input-bar" id="color-palette-input-bar">
                                <input type="text" id="color_palette_name" name="color_palette_name" placeholder="Enter color palette name" value={inputValue.color_palette_name} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("color-palette")}} onBlur={()=>{removeBorderHighlight("color-palette")}}/>
                                <img src="close.png" alt="close button image" onClick={() => {clearInput("color_palette_name")}} style={{opacity: `${inputValue.color_palette_name===""?0:1}`}}/>
                            </div>
                        </div>
                        <div style={{marginBottom: "28px"}}>
                            <label htmlFor="color_name"><b>Color name</b></label>
                            <div className="flex gap-3">
                                <div className="input-bar" id="color-name-input-bar">
                                    <input type="text" id="color_name" name="color_name" placeholder="Enter color name" value={inputValue.color_name} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("color-name")}} onBlur={()=>{removeBorderHighlight("color-name")}} style={{width: "210px"}}/>
                                    <img src="close.png" alt="close button image" onClick={() => {clearInput("color_name")}} style={{opacity: `${inputValue.color_name===""?0:1}`}}/>
                                </div>
                                <button className="add-color-btn" onClick={addColor}>+</button>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn"><b>Save color palette</b></button>
                    </form>
                </div>
            </div>
            <div style={{height: "260px", width: "692px"}}>
                <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", justifyItems: "center", gap: "18px"}}>
                    {
                        colors.map((a_color, index)=>{
                            return  <div key={index} style={{height: "120px", width: "100px", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.33)"}}>
                                        <div style={{display: "flex", justifyContent: "right", padding: "4px", height:"100px", backgroundColor: `${a_color}`}} title={`${a_color}`}>
                                            <img src="close.png" alt="close button image" title="close button" style={{height: "12px", width: "12px", cursor: "pointer"}} onClick={() => {removeColor(`${a_color}`)}}/>
                                        </div>
                                        <p style={{padding: "0px 4px", fontSize: "12px", height: "20px", backgroundColor: "#f8f8f8ff"}}>{a_color}</p>
                                    </div>
                        }).reverse()
                    }
                </div>
            </div>
        </div>
    )
}
