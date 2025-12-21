import { useContext, useEffect, useState } from "react";
import DrawContext from "../../context/draw/DrawContext";
import UserViewColorPalette from "../colorpalette/UserViewColorPalette";

export default function RightNavbar(props) {

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
            {
                (tool!=="text")
                &&
                <div>
                    <div>
                        <div className="flex flex-col">
                            <p>Pen color</p>
                            <div style={{height: "36px", width: "36px", backgroundColor: `${penColor}`}}></div>
                        </div>
                    </div>
                    <div style={{marginTop: "12px"}}>
                        <div className="flex items-center gap-3">                            
                            <p>Pick pen color:</p>
                            <input type="color" value={inputPenColor} onChange={handleInputPenColor} style={{height: "36px", width: "36px", cursor: "pointer"}}/>
                        </div>
                    </div>
                </div>
            }

            {   
                colorPaletteInUse.color_palette_name!=="" && colorPaletteInUse.colors.length!==0 && tool!=="text" ?
                    <div style={{width: "min-content", marginTop: "12px"}}>
                        <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px"}}>
                            {colorPaletteInUse.colors.map((a_color, index)=>{return <div key={index} title={a_color} style={{height: "36px", width: "36px", backgroundColor: `${a_color}`, border: `${penColor===a_color?"2px solid black":"2px solid transparent"}`}} onClick={()=>{setPenColor(a_color); setTextColor(a_color);}}></div>}).reverse()}
                        </div>
                    </div>
                :
                    <div></div>
            }

            {   
                (tool==="text")
                &&
                <div>  
                    <div>
                        <div className="flex flex-col">
                            <p>Text color</p>
                            <div style={{height: "36px", width: "36px", backgroundColor: `${textColor}`}}></div>
                        </div>
                    </div>
                    <div style={{marginTop: "12px"}}>
                        <div className="flex items-center gap-3">
                            <p>Pick text color:</p>
                            <input type="color" value={inputTextColor} onChange={handleInputTextColor} style={{height: "36px", width: "36px", cursor: "pointer"}}/>
                        </div>
                    </div>
                </div>
            }

            {   
                colorPaletteInUse.color_palette_name!=="" && colorPaletteInUse.colors.length!==0 && tool==="text" ?
                    <div style={{width: "min-content", marginTop: "12px"}}>
                        <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px"}}>
                            {colorPaletteInUse.colors.map((a_color, index)=>{return <div key={index} title={a_color} style={{height: "36px", width: "36px", backgroundColor: `${a_color}`, border: `${penColor===a_color?"2px solid black":"2px solid transparent"}`}} onClick={()=>{setTextColor(a_color); setPenColor(a_color);}}></div>}).reverse()}
                        </div>
                    </div>
                :
                    <div></div>
            }

            {   
                (tool==="text")
                &&
                <div style={{marginTop: "12px"}}>
                    <div className="flex items-center gap-2 mb-2">
                        <p>Text Size:</p>
                        <input type="number" value={inputTextSize} onChange={handleInputTextSize} style={{cursor: "pointer", width: "140px", fontSize: "14px", border: "1px solid #ccc"}}/>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <p>Text Font:</p>
                        <select value={inputTextFont} onChange={handleInputTextFont} style={{cursor: "pointer", width: "140px", fontSize: "14px", border: "1px solid #ccc"}}>
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
                    <div className="flex items-center gap-2">
                        <p>Text:</p>
                        <input type="text" value={inputText} onChange={handleInputText} style={{cursor: "pointer", width: "190px", fontSize: "14px", border: "1px solid #ccc"}}/>
                    </div>
                </div>
            }

            <UserViewColorPalette setColorPaletteInUse={setColorPaletteInUse} fromHome={props.fromHome}/>
        </div>
    );
}