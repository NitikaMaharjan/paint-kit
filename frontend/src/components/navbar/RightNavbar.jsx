import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import DrawContext from "../../context/draw/DrawContext";
import CreateColorPaletteForm from "../colorpalette/CreateColorPaletteForm";
import UserViewColorPalette from "../colorpalette/UserViewColorPalette";
import SaveDrawingForm from "../draw/SaveDrawingForm";
import ImageUploadForm from "../draw/ImageUploadForm";

export default function RightNavbar(props) {

    let navigate = useNavigate();

    const { showAlert } = useContext(AlertContext);
    const { showConfirm } = useContext(ConfirmContext);
    const { canvasRef, tool, penColor, textColor, setPenColor, setTextColor, handleExport, setTextSize, setTextFont, setText, undoStack } = useContext(DrawContext);

    const [showExportDropDown, setShowExportDropDown] = useState(false);
    const [showCreateColorPaletteFormModal, setShowCreateColorPaletteFormModal] = useState(false);
    const [showSaveDrawingFormModal, setShowSaveDrawingFormModal] = useState(false);
    const [showImageUploadFormModal, setShowImageUploadFormModal] = useState(false);
    const [inputPenColor, setInputPenColor] = useState("#000000");
    const [inputTextColor, setInputTextColor] = useState("#000000");
    const [inputTextSize, setInputTextSize] = useState("24");
    const [inputTextFont, setInputTextFont] = useState("serif");
    const [inputText, setInputText] = useState("");
    const [colorPaletteInUse, setColorPaletteInUse] = useState({
        color_palette_name: "",
        colors: ""
    });
    
    const handleArrowMouseOver = () => {
        document.getElementById("arrow").style.backgroundColor="rgba(0, 0, 0, 0.048)";
    }
    
    const handleArrowMouseOut = () => {
        document.getElementById("arrow").style.backgroundColor="transparent";
    }

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

    const handleDiscardChanges = async() => {
        let ans = await showConfirm("Discard changes");
        if(ans){
            navigate("/viewdrawing");
        }
    }

    const handleImageUpload = (imageUrl) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            const imgAspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;

            let drawWidth, drawHeight;

            if(imgAspect>canvasAspect){
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgAspect;
            }else{
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgAspect;
            }

            const offsetX = (canvas.width - drawWidth) / 2;
            const offsetY = (canvas.height - drawHeight) / 2;

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            
            showAlert("Success", "Uploaded image loaded successfully!");
        }

        img.onerror = () => {
            showAlert("Error", "Failed to load image. Please try again!");
        }
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
        <>
            <div className="right-navbar">
                {
                    (tool!=="text")
                    &&
                    <div style={{padding: "18px 0px"}}>
                        <div>
                            <div className="flex flex-col">
                                <p>Pen color</p>
                                <div style={{height: "36px", width: "36px", backgroundColor: `${penColor}`}}></div>
                            </div>
                        </div>
                        <div style={{marginTop: "12px"}}>
                            <div className="flex items-center">                            
                                <p>Pick pen color:</p>
                                <input type="color" value={inputPenColor} onChange={handleInputPenColor} style={{height: "36px", width: "36px", cursor: "pointer"}}/>
                            </div>
                        </div>
                    </div>
                }

                {   
                    colorPaletteInUse.color_palette_name!=="" && colorPaletteInUse.colors.length!==0 && tool!=="text" ?
                        <div style={{margin: "0px 0px 18px 0px", width: "min-content"}}>
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
                    <div style={{padding: "18px 0px"}}>  
                        <div>
                            <div className="flex flex-col">
                                <p>Text color</p>
                                <div style={{height: "36px", width: "36px", backgroundColor: `${textColor}`}}></div>
                            </div>
                        </div>
                        <div style={{marginTop: "12px"}}>
                            <div className="flex items-center">
                                <p>Pick text color:</p>
                                <input type="color" value={inputTextColor} onChange={handleInputTextColor} style={{height: "36px", width: "36px", cursor: "pointer"}}/>
                            </div>
                        </div>
                    </div>
                }

                {   
                    colorPaletteInUse.color_palette_name!=="" && colorPaletteInUse.colors.length!==0 && tool==="text" ?
                        <div style={{margin: "0px 0px 18px 0px", width: "min-content"}}>
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
                    <>
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
                        <div className="flex items-center gap-2 mb-4">
                            <p>Text:</p>
                            <input type="text" value={inputText} onChange={handleInputText} style={{cursor: "pointer", width: "190px", fontSize: "14px", border: "1px solid #ccc"}}/>
                        </div>
                    </>
                }

                {
                    localStorage.getItem("userSignedIn") && localStorage.getItem("user_token") ?
                        <><Link className="action-btn" to="/viewtemplate">View template</Link><br/></>
                    :
                        <><button className="action-btn" onClick={()=>{props.checkUserSignedIn()}}>View template</button><br/></>
                }

                <button className="action-btn mt-2 mb-2" onClick={()=>{if(props.checkUserSignedIn()){setShowImageUploadFormModal(true)}}}>Upload image</button><br/>

                {
                    localStorage.getItem("userSignedIn") && localStorage.getItem("user_token") ?
                        <><Link className="action-btn" to="/generatecolorpalette" target="_blank">Open color palette generator</Link><br/></>
                    :
                        <><button className="action-btn" onClick={()=>{props.checkUserSignedIn()}}>Open color palette generator</button><br/></>
                }

                <button className="action-btn mt-2 mb-2" onClick={()=>{if(props.checkUserSignedIn()){setShowSaveDrawingFormModal(true)}}}>Save drawing</button><br/>
                
                {
                    localStorage.getItem("userSignedIn") && localStorage.getItem("user_token") ?
                        <><Link className="action-btn" to="/viewdrawing">View your drawing</Link><br/></>
                    :
                        <><button className="action-btn" onClick={()=>{props.checkUserSignedIn()}}>View your drawing</button><br/></>
                }

                {
                    props.edit===true ?
                    <button className="action-btn mt-2" onClick={handleDiscardChanges}>Discard changes</button>
                    :
                    <div></div>
                }
                
                <div className="mt-2">
                    <div id="arrow" onMouseOver={handleArrowMouseOver} onMouseOut={handleArrowMouseOut} style={{padding: "4px", width: "min-content"}}>
                        <button className="dropdown-btn flex gap-4" style={{width: "100px"}} onClick={()=>{if(props.checkUserSignedIn()){setShowExportDropDown(!showExportDropDown)}}}><p>Export</p><img src="/down-arrow.png" alt="down arrow icon" style={{height: "14px", width: "14px"}}/></button>
                    </div>
                    {
                        showExportDropDown
                        &&
                        <div className="dropdown-content">
                            <button className="dropdown-content-button" onClick={()=>{handleExport(props.title, "png")}}>Export as png</button>
                            <button className="dropdown-content-button" onClick={()=>{handleExport(props.title, "jpeg")}}>Export as jpeg</button>
                        </div>
                    }
                </div>
                <UserViewColorPalette setColorPaletteInUse={setColorPaletteInUse}/>
                <button onClick={()=>{if(props.checkUserSignedIn()){setShowCreateColorPaletteFormModal(true)}}} className="confirm-btn" style={{position: "fixed", bottom: "20px", right: "48px", width: "200px"}}>Create Color Palette</button>
            </div>
            
            {
                showCreateColorPaletteFormModal
                &&
                <div className="confirm-modal-background">
                    <CreateColorPaletteForm setShowCreateColorPaletteFormModal={setShowCreateColorPaletteFormModal}/>
                </div>
            }

            {
                showSaveDrawingFormModal
                &&
                <div className="confirm-modal-background">
                    <SaveDrawingForm title={props.title} tag={props.tag} edit={props.edit} drawingid={props.drawingid} setShowSaveDrawingFormModal={setShowSaveDrawingFormModal}/>
                </div>
            }

            {
                showImageUploadFormModal
                &&
                <div className="confirm-modal-background">
                    <ImageUploadForm handleImageUpload={handleImageUpload} setShowImageUploadFormModal={setShowImageUploadFormModal}/>
                </div>
            }
        </>
    );
}