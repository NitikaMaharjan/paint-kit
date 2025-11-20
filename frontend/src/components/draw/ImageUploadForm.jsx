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
        const maxSizeMB = 2;
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
            <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Upload Image</b></h1>
            <form className="auth-form">
                <div style={{marginBottom: "28px"}}>
                    <label>Upload Image</label>
                    <div className="input-bar">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={updateImageUrl}/>
                    </div>
                </div>
                <button type="submit" className="submit-btn" onClick={handleImageUpload}><b>Upload Image</b></button>
            </form>
        </div>
    );
}
