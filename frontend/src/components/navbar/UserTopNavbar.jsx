import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import DrawContext from "../../context/draw/DrawContext";
import ViewUndoRedoHistory from "../draw/ViewUndoRedoHistory";
import ChangePasswordForm from "../ChangePasswordForm";
import CreateColorPaletteForm from "../colorpalette/CreateColorPaletteForm";
import SaveDrawingForm from "../draw/SaveDrawingForm";
import ImageUploadForm from "../draw/ImageUploadForm";

export default function UserTopNavbar(props) {

    let navigate = useNavigate();

    const { showAlert } = useContext(AlertContext);
    const { showConfirm } = useContext(ConfirmContext);
    const { canvasRef, handleClearCanvas, handleExport, undoStack } = useContext(DrawContext);

    const [showSettingDropDown, setShowSettingDropDown] = useState(false);
    const [showUndoRedoHistoryModal, setShowUndoRedoHistoryModal] = useState(false);
    const [showChangePasswordFormModal, setShowChangePasswordFormModal] = useState(false);
    const [showExportDropDown, setShowExportDropDown] = useState(false);
    const [showCreateColorPaletteFormModal, setShowCreateColorPaletteFormModal] = useState(false);
    const [showSaveDrawingFormModal, setShowSaveDrawingFormModal] = useState(false);
    const [showImageUploadFormModal, setShowImageUploadFormModal] = useState(false);

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
        document.getElementById("arrow").style.backgroundColor="rgba(0, 0, 0, 0.05)";
    }
    
    const handleMouseOut = () => {
        document.getElementById("arrow").style.backgroundColor="transparent";
    }

    const handleArrowMouseOver = () => {
        document.getElementById("arrow").style.backgroundColor="rgba(0, 0, 0, 0.048)";
    }
    
    const handleArrowMouseOut = () => {
        document.getElementById("arrow").style.backgroundColor="transparent";
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

    return (
        <>
            <div className="user-top-navbar">
                {/* <div>
                    <button className="action-btn" onClick={()=>{if(props.checkUserSignedIn()){setShowUndoRedoHistoryModal(true)}}}>View Undo/Redo History</button>
                    <button className="action-btn" onClick={handleClearCanvas}>clear all</button>
                </div> */}
                {/* {
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
                </div> */}
                {/* <button onClick={()=>{if(props.checkUserSignedIn()){setShowCreateColorPaletteFormModal(true)}}} className="confirm-btn" style={{position: "fixed", bottom: "20px", right: "48px", width: "200px"}}>Create Color Palette</button> */}
                <img src="/logo.png" style={{height: "40px", width: "40px"}}/>
                <div className="flex flex-col" style={{width: "100%"}}>
                    <div className="flex items-center justify-between">
                        <h1 style={{fontSize: "16px"}}><b>Paint Kit</b></h1>
                        {
                            localStorage.getItem("userSignedIn") && localStorage.getItem("user_token") ?
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center" style={{border: "1px solid rgba(0, 0, 0, 0.8)", height: "19px", width: "19px", borderRadius: "18px"}}>
                                        <img src="/user.png" alt="user icon" style={{height: "13px", width: "13px"}}/>
                                    </div>&nbsp;
                                    <p style={{fontSize: "13px"}}>{handleCapitalizeFirstLetter(localStorage.getItem("user_username"))}</p>&nbsp;
                                    <p style={{fontSize: "13px"}}><b>|</b> {localStorage.getItem("user_email")}</p>&nbsp;
                                    <div>
                                        <div id="arrow" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{padding: "4px"}}>
                                            <button className="dropdown-btn" onClick={()=>{setShowSettingDropDown(!showSettingDropDown)}}><img src="/down-arrow.png" alt="down arrow icon" style={{height: "14px", width: "14px"}}/></button>
                                        </div>
                                        {
                                            showSettingDropDown
                                            &&
                                            <div className="dropdown-content">
                                                <button className="dropdown-content-button" onClick={()=>{setShowChangePasswordFormModal(true);setShowSettingDropDown(!showSettingDropDown);}}>Change password</button>
                                                <button className="dropdown-content-button" onClick={()=>{handleSignOut();setShowSettingDropDown(!showSettingDropDown);}}>Sign out</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            :
                            <div className="flex gap-6">
                                <Link className="action-btn" to="/usersignin">Sign in</Link>
                                <Link className="action-btn" to="/usersignup">Sign up</Link>
                            </div>
                        }
                    </div>
                    <div className="flex gap-4">
                        <button className="user-top-navbar-btn">Drawing</button>
                        <button className="user-top-navbar-btn">Color Palette</button>
                        <button className="user-top-navbar-btn">View Template</button>
                        <button className="user-top-navbar-btn">View Drawing</button>
                    </div>
                </div>
            </div>

            {
                showUndoRedoHistoryModal
                &&
                <div className="view-history-modal-background">
                    <div style={{position: "fixed", top: "30px", right: "30px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowUndoRedoHistoryModal(false)}}>
                        <img src="/close-white.png" alt="close icon" style={{height: "18px", width: "18px"}}/>
                    </div>
                    <ViewUndoRedoHistory setShowUndoRedoHistoryModal={setShowUndoRedoHistoryModal}/>
                </div>
            }

            {
                showChangePasswordFormModal
                &&
                <div className="confirm-modal-background">
                    <ChangePasswordForm setShowChangePasswordFormModal={setShowChangePasswordFormModal}/>
                </div>
            }

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