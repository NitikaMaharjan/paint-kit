import { useContext, useEffect, useState, useRef } from "react";
import DrawContext from "../../context/draw/DrawContext";
import UserViewColorPalette from "../colorpalette/UserViewColorPalette";

export default function RightNavbar(props) {

    const pickAColor = useRef(null);

    const { tool, penColor, textColor, setPenColor, setTextColor, setTextSize, setTextFont, setText } = useContext(DrawContext);

    const [inputPenColor, setInputPenColor] = useState("#000000");
    const [inputTextColor, setInputTextColor] = useState("#000000");
    const [inputTextSize, setInputTextSize] = useState("24");
    const [inputTextFont, setInputTextFont] = useState("serif");
    const [inputText, setInputText] = useState("");
    const [colorPaletteInUse, setColorPaletteInUse] = useState({
        color_palette_name: "",
        colors: ""
    });

    const handleInputPenColor = (e) => {
        if(props.checkUserSignedIn()){
            setInputPenColor(e.target.value);
            setInputTextColor(e.target.value);
        }
    }
    
    const handleInputTextColor = (e) => {
        setInputTextColor(e.target.value);
        setInputPenColor(e.target.value);
    }
    
    const handleInputTextSize = (e) => {
        setInputTextSize(e.target.value);
    }
    
    const handleInputTextFont = (e) => {
        setInputTextFont(e.target.value);
    }
    
    const handleInputText = (e) => {
        setInputText(e.target.value);
    }

    const calculateBrightness = (hexColor) => {
        let color_without_hash = hexColor.replace("#", "");

        const r = parseInt(color_without_hash.substring(0, 2), 16);
        const g = parseInt(color_without_hash.substring(2, 4), 16);
        const b = parseInt(color_without_hash.substring(4, 6), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness>128?"2px solid black":"2px solid #ccc";
    }

    const addBorderHighlight = (type) => {
        document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
    }
    
    const removeBorderHighlight = (type) => {
        document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
    }

    const clearInput = () => {
        setInputText("");
    }

    useEffect(() => {
      setPenColor(inputPenColor); 
      setTextColor(inputPenColor);
    }, [inputPenColor]);
    
    useEffect(() => {
        setTextColor(inputTextColor);
        setPenColor(inputTextColor); 
    }, [inputTextColor]);
    
    useEffect(() => {
      setTextSize(inputTextSize);
    }, [inputTextSize]);
    
    useEffect(() => {
      setTextFont(inputTextFont);
    }, [inputTextFont]);
    
    useEffect(() => {
      setText(inputText);
    }, [inputText]);

    return (
        <div className="right-navbar">
            <div>
                <div className="flex items-center justify-center">
                    {
                        tool !== "text" ?
                            <>
                                <p style={{fontSize: "14px", width: "140px"}}>Pick pen color:</p>
                                <img src="/color.png" style={{height: "28px", width: "28px", cursor: "pointer"}} onClick={()=>{pickAColor.current?.click()}}/>
                                <input type="color" ref={pickAColor} value={inputPenColor} onChange={handleInputPenColor} style={{height: "36px", width: "2px", opacity: "0"}}/>
                            </>
                        :
                            <>
                                <p style={{fontSize: "14px", width: "140px"}}>Pick text color:</p>
                                <img src="/color.png" style={{height: "28px", width: "28px", cursor: "pointer"}} onClick={()=>{pickAColor.current?.click()}}/>
                                <input type="color" ref={pickAColor} value={inputTextColor} onChange={handleInputTextColor} style={{height: "36px", width: "2px", opacity: "0"}}/>
                            </>
                    }
                    <div style={{height: "24px", width: "24px", backgroundColor: `${tool!=="text"?penColor:textColor}`, cursor: "pointer"}} onClick={()=>{pickAColor.current?.click()}}></div>
                </div>

                <div className="flex justify-center">
                    {   
                        colorPaletteInUse.color_palette_name!=="" && colorPaletteInUse.colors.length!==0 ?
                            <div style={{width: "min-content", marginTop: "6px"}}>
                                <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px"}}>
                                    {
                                        colorPaletteInUse.colors.map((a_color, index)=>{
                                            return <div key={index} title={a_color} style={{height: "36px", width: "36px", backgroundColor: `${a_color}`, border: `${penColor===a_color?calculateBrightness(a_color):"2px solid transparent"}`, cursor: "pointer"}} onClick={()=>{setPenColor(a_color); setTextColor(a_color);}}></div>
                                        }).reverse()
                                    }
                                    {
                                        Array.from({length: 12 - colorPaletteInUse.colors.length}).map((key, index)=>{
                                            return <div key={index} style={{height: "36px", width: "36px", backgroundColor: "white", border: "1px solid #ccc"}}></div>
                                        })
                                    }
                                </div>
                            </div>
                        :
                            <div style={{width: "min-content", marginTop: "6px"}}>
                                <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px"}}>
                                    {
                                        Array.from({length: 12}).map((key, index)=>{
                                            return <div key={index} style={{height: "36px", width: "36px", backgroundColor: "white", border: "1px solid #ccc"}}></div>
                                        })
                                    }
                                </div>
                            </div>
                    }
                </div>

                {
                    tool === "text"
                    &&
                    <div className="flex flex-col mt-3">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <p style={{fontSize: "14px"}}>Text size:</p>
                            <form className="auth-form" style={{margin: "0px"}}>
                                <div className="input-bar" id="text-size-input-bar">
                                    <input type="number" value={inputTextSize} onChange={handleInputTextSize} onFocus={()=>{addBorderHighlight("text-size")}} onBlur={()=>{removeBorderHighlight("text-size")}} style={{width: "120px"}}/>
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <p style={{fontSize: "14px"}}>Text Font:</p>
                            <select value={inputTextFont} onChange={handleInputTextFont} style={{cursor: "pointer", height: "25.5px", fontSize: "13px", border: "1px solid #ccc"}}>
                                <option value="serif">Serif</option>
                                <option value="sans-serif">Sans Serif</option>
                                <option value="monospace">Monospace</option>
                                <option value="fantasy">Fantasy</option>
                                <option value="cursive">Cursive</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <p style={{fontSize: "14px"}}>Text:</p>
                            <form className="auth-form" style={{margin: "0px"}}>
                                <div className="input-bar" id="text-input-bar">
                                    <input type="text" placeholder="Enter text" value={inputText} onChange={handleInputText} onFocus={()=>{addBorderHighlight("text")}} onBlur={()=>{removeBorderHighlight("text")}} style={{width: "145px"}}/>
                                    <img src="/close.png" alt="close icon" onClick={()=>{clearInput()}} style={{opacity: `${inputText===""?"0":"1"}`}}/>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>

            <div style={{height: "300px"}}>
                <UserViewColorPalette setColorPaletteInUse={setColorPaletteInUse} fromHome={props.fromHome}/>
            </div>
        </div>
    );
}