import { useState } from "react";

export default function ImageUploadForm(props) {

    const [inputFile, setInputFile] = useState(null);

    const updateImageUrl = (e)=> {
        const file = e.target.files[0];
        if (file){
            const fileURL = URL.createObjectURL(file);
            setInputFile(fileURL);
        }
    }

    const handleImageUpload = (e)=> {
        e.preventDefault();
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
                        <input type="file" accept="image/*" onChange={updateImageUrl}/>
                    </div>
                </div>
                <button type="submit" className="submit-btn" onClick={handleImageUpload}><b>Upload Image</b></button>
            </form>
        </div>
    )
}
