import { useState } from "react";

export default function CreateColorPalette() {

    const [colors, setColors] = useState([]);
    const [inputColor, setInputColor] = useState("");

    const updateColorValue = (e) => {
        setInputColor(e.target.value);
    }

    const addColor = () => {
        setColors([...colors, inputColor]);
    }

    return (
        <div className="content">
            <div className="auth-form-box">
                <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Create Color Palette</b></h1>
                <form className="auth-form">
                    <div className="mb-1">
                        <label htmlFor="color_palette_name"><b>Color palette name</b></label>
                        <div className="input-bar" id="color-palette-input-bar">
                            <input type="text" id="color_palette_name" name="color_palette_name" placeholder="Enter color palette name"/>
                        </div>
                    </div>
                    <div className="mb-1">
                        <label htmlFor="colors"><b>Colors (max 12)</b></label>
                        <div className="input-bar" id="colors-input-bar">
                            <input type="text" id="colors" name="colors" placeholder="Enter colors hex code" onChange={updateColorValue} value={inputColor}/>
                        </div>
                    </div>
                </form>
                <button className="confirm-btn" onClick={addColor}>+</button>
                <p>Colors:</p>
                {colors.map((a_color, index)=>{return <div key={index} style={{border: "1px solid black", height: "32px", width: "32px", backgroundColor: `${a_color}`}}></div>})}
            </div>
        </div>
    )
}
