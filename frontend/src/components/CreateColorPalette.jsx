import { useState } from "react";

export default function CreateColorPalette() {

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

    const addColor = () => {
        setColors([...colors, inputValue.color_name]);
        setInputValue({...inputValue, ["color_name"]: ""});
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
        <div className="content">
            <div className="auth-form-box">
                <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Create color palette</b></h1>
                <div className="flex">
                    <form className="auth-form" style={{marginRight: "8px", marginBottom: "18px"}}>
                        <div className="mb-1">
                            <label htmlFor="color_palette_name"><b>Color palette name</b></label>
                            <div className="input-bar" id="color-palette-input-bar">
                                <input type="text" id="color_palette_name" name="color_palette_name" placeholder="Enter color palette name" value={inputValue.color_palette_name} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("color-palette")}} onBlur={()=>{removeBorderHighlight("color-palette")}}/>
                                <img src="close.png" alt="close button image" onClick={() => {clearInput("color_palette_name")}} style={{opacity: `${inputValue.color_palette_name===""?0:1}`}}/>
                            </div>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="color_name"><b>Color name</b></label>
                            <div className="input-bar" id="color-name-input-bar">
                                <input type="text" id="color_name" name="color_name" placeholder="Enter color name" value={inputValue.color_name} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("color-name")}} onBlur={()=>{removeBorderHighlight("color-name")}}/>
                                <img src="close.png" alt="close button image" onClick={() => {clearInput("color_name")}} style={{opacity: `${inputValue.color_name===""?0:1}`}}/>
                            </div>
                        </div>
                    </form>
                    <button className="add-color-btn" onClick={addColor}>+</button>
                </div>
                <div style={{margin: "0px 24px 24px 24px", height: "206px", width: "317px", overflowY: "auto"}}>
                    <div style={{height: "min-content", width: "286px"}}>
                        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: "10px", rowGap: "14px"}}>
                            {colors.map((a_color, index)=>{
                                return  <div key={index} style={{border: "1px solid black", height: "96px", width: "84px"}}>
                                            <div style={{display: "flex", justifyContent: "right", padding: "4px", height: "76px", backgroundColor: `${a_color}`}}>
                                                <img src="close.png" alt="close button image" style={{height: "12px", width: "12px", cursor: "pointer"}} onClick={() => {removeColor(`${a_color}`)}}/>
                                            </div>
                                            <p style={{paddingLeft: "4px", fontSize: "12px"}}>{a_color}</p>
                                        </div>
                            }).reverse()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
