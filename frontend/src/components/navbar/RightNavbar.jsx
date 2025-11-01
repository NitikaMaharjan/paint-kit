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
    const { canvasRef, penColor, setPenColor, setTextColor, handleExport, setTextSize, setTextFont, setText, undoStack } = useContext(DrawContext);

    const [showSettingDropDown, setShowSettingDropDown] = useState(false);
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

    const handleSignOut = async() => {
        let ans = await showConfirm("Sign out");
        if(ans){
            localStorage.removeItem("userSignedIn");
            localStorage.removeItem("userAuthToken");
            localStorage.removeItem("user_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_username");
            navigate("/usersignin");
            showAlert("Success", "You've signed out. See you next time!");
        }
    }

    const handleCapitalizeFirstLetter = (text) => {
        let words = text.split(" ");
        for (let i=0; i<words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase()+words[i].substring(1).toLowerCase();
        }
        text = (words.join(" "));
        return text.length>18?text.slice(0,18)+"...":text;
    }

    const handleMouseOver = () => {
        document.getElementById("user-info").style.backgroundColor="rgba(0, 0, 0, 0.1)";
    }
    
    const handleMouseOut = () => {
        document.getElementById("user-info").style.backgroundColor="transparent";
    }

    const handleInputPenColor = (e) => {
        setInputPenColor(e.target.value);
    }
    
    const handleInputTextColor = (e) => {
        setInputTextColor(e.target.value);
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
    }, [inputPenColor]);
    
    useEffect(() => {
      setTextColor(inputTextColor);
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
                <div id="user-info" className="flex items-center justify-between p-2" style={{borderRadius: "3px"}}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center" style={{border: "1px solid black", height: "24px", width: "24px", borderRadius: "24px"}}>
                            <img src="/user.png" style={{height: "18px", width: "18px"}}/>
                        </div>
                        <div style={{lineHeight: "18px"}}>
                            <p style={{fontSize: "14px"}} title={localStorage.getItem("user_username")}><b>{handleCapitalizeFirstLetter(localStorage.getItem("user_username")?localStorage.getItem("user_username"):"")}</b></p>
                            <p style={{fontSize: "13px", color: "rgba(0, 0, 0, 0.7)"}} title={localStorage.getItem("user_email")}>{localStorage.getItem("user_email")?localStorage.getItem("user_email").length>20?localStorage.getItem("user_email").slice(0,20)+"...":localStorage.getItem("user_email"):""}</p>
                        </div>
                    </div>
                    <div>
                        <button className="dropdown-btn" onClick={()=>{setShowSettingDropDown(!showSettingDropDown)}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}><img src="/down-arrow.png" style={{height: "14px", width: "14px"}}/></button>
                        {
                            showSettingDropDown
                            &&
                            <div className="dropdown-content">
                                <button className="dropdown-content-button">Others</button>
                                <button className="dropdown-content-button" onClick={handleSignOut}>Sign out</button>
                            </div>
                        }
                    </div>
                </div>
                <div style={{paddingTop: "18px"}}>
                    <p>Pen color:</p>
                    <div style={{height: "32px", width: "32px", backgroundColor: `${penColor}`}}></div>
                </div>
                <div style={{paddingTop: "18px"}}>
                    <p>Pick pen color:</p>
                    <input type="color" value={inputPenColor} onChange={handleInputPenColor} style={{height: "32px", width: "32px", cursor: "pointer"}}/>
                </div>
                {   
                    colorPaletteInUse.color_palette_name!=="" && colorPaletteInUse.colors.length!==0 ?
                        <div className="color-palette-item">
                            <div style={{padding: "12px 12px 4px 12px"}}>
                                <p title={colorPaletteInUse.color_palette_name} style={{fontSize: "13px"}}>{colorPaletteInUse.color_palette_name}</p>
                            </div>
                            <div style={{padding: "0px 12px 12px 12px"}}>
                                <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "2px"}}>
                                    {colorPaletteInUse.colors.map((a_color, index)=>{return <div key={index} title={a_color} style={{height: "32px", width: "32px", backgroundColor: `${a_color}`}} onClick={()=>{setPenColor(a_color)}}></div>}).reverse()}
                                </div>
                            </div>
                        </div>
                    :
                        <div></div>
                }
                <div style={{paddingTop: "18px"}}>
                    <p>Pick text color:</p>
                    <input type="color" value={inputTextColor} onChange={handleInputTextColor} style={{height: "32px", width: "32px", cursor: "pointer"}}/>
                </div>
                <div>
                    <p>Text Size:</p>
                    <input type="number" value={inputTextSize} onChange={handleInputTextSize} style={{cursor: "pointer"}}/>
                </div>
                <div>
                    <p>Text Font:</p>
                    <input type="text" value={inputTextFont} onChange={handleInputTextFont} style={{cursor: "pointer"}}/>
                </div>
                <div>
                    <p>Text:</p>
                    <input type="text" value={inputText} onChange={handleInputText} style={{cursor: "pointer"}}/>
                </div>
                <Link className="confirm-btn" to="/viewtemplate">View template</Link>
                <button className="confirm-btn" onClick={()=>{setShowImageUploadFormModal(true)}}>Upload image</button>
                <Link className="confirm-btn" to="/generatecolorpalette" target="_blank">Open color palette generator</Link>
                <button className="confirm-btn" onClick={()=>{setShowSaveDrawingFormModal(true)}}>Save drawing</button>
                <Link className="confirm-btn" to="/viewdrawing">View your drawing</Link>
                {
                    props.edit===true ?
                    <button className="confirm-btn" onClick={handleDiscardChanges}>Discard changes</button>
                    :
                    <div></div>
                }
                <div>
                    <button className="dropdown-btn" onClick={()=>{setShowExportDropDown(!showExportDropDown)}}>Export <img src="/down-arrow.png" style={{height: "14px", width: "14px"}}/></button>
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
                <button onClick={()=>{setShowCreateColorPaletteFormModal(true)}} className="confirm-btn" style={{position: "fixed", bottom: "20px", right: "48px", width: "200px"}}>Create Color Palette</button>
            </div>
            
            {
                showCreateColorPaletteFormModal
                &&
                <div className="confirm-modal-background">
                    <div className="flex items-center pt-8 gap-10">
                        <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowCreateColorPaletteFormModal(false)}}>
                            <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                        </div>
                        <CreateColorPaletteForm setShowCreateColorPaletteFormModal={setShowCreateColorPaletteFormModal}/>
                    </div>
                </div>
            }

            {
                showSaveDrawingFormModal
                &&
                <div className="confirm-modal-background">
                    <div className="flex items-center pt-8 gap-10">
                        <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowSaveDrawingFormModal(false)}}>
                            <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                        </div>
                        <SaveDrawingForm title={props.title} tag={props.tag} edit={props.edit} drawingid={props.drawingid}/>
                    </div>
                </div>
            }

            {
                showImageUploadFormModal
                &&
                <div className="confirm-modal-background">
                    <div className="flex items-center pt-8 gap-10">
                        <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowImageUploadFormModal(false)}}>
                            <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                        </div>
                        <ImageUploadForm handleImageUpload={handleImageUpload} setShowImageUploadFormModal={setShowImageUploadFormModal}/>
                    </div>
                </div>
            }
        </>
    );
}
