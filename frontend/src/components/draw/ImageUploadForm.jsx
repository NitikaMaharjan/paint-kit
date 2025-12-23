import { useContext, useState, useRef } from "react";
import AlertContext from "../../context/alert/AlertContext";

export default function ImageUploadForm(props) {

    const fileInputRef = useRef(null);

    const { showAlert } = useContext(AlertContext);

    const [inputFile, setInputFile] = useState(null);

    const updateImageUrl = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // file validation
        const validTypes = ["image/png", "image/jpeg"];
        const maxSizeMB = 5;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            showAlert("Warning", "Only PNG and JPEG images are allowed!");
            fileInputRef.current.value = ""; 
            return;
        }

        if (file.size > maxSizeBytes) {
            showAlert("Warning", `Image size must be less than ${maxSizeMB} MB!`);
            fileInputRef.current.value = "";
            return;
        }

        const fileURL = URL.createObjectURL(file);
        setInputFile(fileURL);
    }

    const clearInput = () => {
        setInputFile(null);
        fileInputRef.current.value = "";
    }

    const addBorderHighlight = (type) => {
        document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
    }
    
    const removeBorderHighlight = (type) => {
        document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
    }

    const handleImageUpload = (e) => {
        e.preventDefault();
        if(!inputFile){
            showAlert("Warning", "Please select an image before uploading!");
            return;
        }
        props.handleImageUpload(inputFile);
        props.setShowImageUploadFormModal(false);
    }

    return (
        <div className="auth-form-box">
            <div className="flex items-center justify-center" style={{borderBottom: "1px solid black", backgroundColor: "#ccc", width: "100%"}}>
                <h1 style={{fontSize: "14px", textAlign: "center", width: "86%", padding: "8px 0px", borderRight: "1px solid black"}}><b>Upload image</b></h1>
                <div style={{marginLeft: "10px", cursor: "pointer"}} onClick={()=>{props.setShowImageUploadFormModal(false)}}>
                    <img src="/close.png" alt="close icon" style={{height: "14px", width: "14px"}}/>
                </div>
            </div>
            <form className="auth-form">
                <div style={{marginBottom: "28px"}}>
                    <label htmlFor="image_url"><b>Upload image</b></label>
                    <div className="input-bar mb-3" id="image-url-input-bar">
                        <input type="file" id="image_url" name="image_url" accept="image/*" ref={fileInputRef} onChange={updateImageUrl} onFocus={()=>{addBorderHighlight("image-url")}} onBlur={()=>{removeBorderHighlight("image-url")}} style={{color: `${inputFile===null?"rgba(0, 0, 0, 0.6)":"black"}`, fontSize: "13px"}}/>
                        <img src="/close.png" alt="close icon" onClick={()=>{clearInput()}} style={{opacity: `${inputFile===null?"0":"1"}`}}/>
                    </div>
                    <div className="flex items-center justify-center" style={{height: "160px", width: "284px", border: "1px solid rgba(0, 0, 0, 0.3)"}}>
                        <img src={`${inputFile===null?"/no-image.png":inputFile}`} alt="uploaded image" style={{height: `${inputFile===null?"24px":"100%"}`, width: `${inputFile===null?"24px":"100%"}`, objectFit: "contain"}}/>
                    </div>
                </div>
                <button type="submit" className="submit-btn" onClick={handleImageUpload}><b>Upload Image</b></button>
            </form>
        </div>
    );
}