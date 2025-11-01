import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";

export default function AddTemplateForm(props) {

  let navigate = useNavigate();

  const { showAlert } = useContext(AlertContext);

  const [inputValue, setInputValue] = useState({
    template_title: "",
    template_tag: ""
  });
  const [inputFile, setInputFile] = useState(null);

  const updateInputValue = (e) => {
    setInputValue({...inputValue, [e.target.name]: e.target.value.trimStart()});
  }

  const clearInput = (input_field) => {
    setInputValue({...inputValue, [input_field]: ""});
  }

  const addBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }

  const updateImageUrl = (e) => {
    const file = e.target.files[0];
    setInputFile(file.name);
  }

  const validateInputValue = () => {
    const textRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;

    let template_title = inputValue.template_title.trim();
    let template_tag = inputValue.template_tag.trim();

    if(template_title==="" && template_tag!==""){
      showAlert("Warning", "Title is required. Please try again!");
      return false;
    }
    
    if(template_title!=="" && template_tag===""){
      showAlert("Warning", "Tag is required. Please try again!");
      return false;
    }
    
    if(template_title==="" || template_tag===""){
      showAlert("Warning", "Please enter the input data to save the template!");
      return false;
    }

    if(template_title.length<3){
      showAlert("Warning", "Title must be atleast 3 characters!");
      return false;
    }
        
    if(template_title.length>25){
      showAlert("Warning", "Title cannot be more than 25 characters!");
      return false;
    }

    if(!textRegex.test(template_title)){
      showAlert("Warning", "Title can only contain letters, numbers and single consecutive space!");
      return false;
    }
    
    if(template_tag.length<3){
      showAlert("Warning", "Tag must be atleast 3 characters!");
      return false;
    }
        
    if(template_tag.length>20){
      showAlert("Warning", "Tag cannot be more than 20 characters!");
      return false;
    }

    if(!textRegex.test(template_tag)){
      showAlert("Warning", "Tag can only contain letters, numbers and single consecutive space!");
      return false;
    }
    return true;
  }
  
  const handleSaveTemplate = async(e) => {
    e.preventDefault();
    if(validateInputValue()){
      try{
        const response = await fetch(`http://localhost:5000/api/template/savetemplate`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("admin_id"),
            template_title: inputValue.template_title.trim(),
            template_tag: inputValue.template_tag.trim(),
            image_url: "/uploads/"+inputFile
          })
        });
        const json = await response.json();

        if(json.success){
          props.setShowAddTemplateFormModal(false);
          showAlert("Success", "Template has been saved successfully!");
          navigate("/viewtemplate");
        }else{
          if(json.error){
            showAlert("Error", json.error);
          }          
          if(json.errors){
            showAlert("Error", json.errors.map(err => err.msg).join("\n")+"\nPlease try again!");
          }
        }
      }catch(err){
        showAlert("Error", "Network error. Please check your connection or try again later!")
      }
    }
  }

  return (
    <div className="auth-form-box">
      <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Add template</b></h1>
      <form className="auth-form">
        <div className="mb-1">
          <label htmlFor="template_title"><b>Title</b></label>
          <div className="input-bar" id="template-title-input-bar">
            <input type="text" id="template_title" name="template_title" placeholder="Enter title" value={inputValue.template_title} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("template-title")}} onBlur={()=>{removeBorderHighlight("template-title")}}/>
            <img src="/close.png" alt="close button image" onClick={()=>{clearInput("template_title")}} style={{opacity: `${inputValue.template_title===""?0:1}`}}/>
          </div>
        </div>          
        <div className="mb-1">
          <label htmlFor="template_tag"><b>Tag</b></label>
          <div className="input-bar" id="template-tag-input-bar">
            <input type="text" id="template_tag" name="template_tag" placeholder="Enter tag" value={inputValue.template_tag} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("template-tag")}} onBlur={()=>{removeBorderHighlight("template-tag")}}/>
            <img src="/close.png" alt="close button image" onClick={()=>{clearInput("template_tag")}} style={{opacity: `${inputValue.template_tag===""?0:1}`}}/>
          </div>
        </div>
        <div style={{marginBottom: "28px"}}>
          <label><b>Upload Image</b></label>
          <div className="input-bar">
              <input type="file" accept="image/*" onChange={updateImageUrl}/>
          </div>
        </div>
        <button type="submit" className="submit-btn" onClick={handleSaveTemplate}><b>Save template</b></button>
      </form>
    </div>
  );
}
