import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import DrawContext from "../../context/draw/DrawContext";

export default function DrawingInfoForm(props) {

  let navigate = useNavigate();

  const { showAlert } = useContext(AlertContext);
  const { canvasRef } = useContext(DrawContext);

  const [inputValue, setInputValue] = useState({
    drawing_title: props.title,
    drawing_tag: props.tag
  });

  const updateInputValue = (e)=> {
    setInputValue({...inputValue, [e.target.name]: e.target.value.trimStart()});
  }

  const clearInput = (input_field) => {
    setInputValue({...inputValue, [input_field]: ""});
  }

  const validateInputValue = ()=> {
    const textRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;

    let drawing_title = inputValue.drawing_title.trim();
    let drawing_tag = inputValue.drawing_tag.trim();

    if(drawing_title==="" && drawing_tag!==""){
      showAlert("Warning", "Title is required. Please try again!");
      return false;
    }
    
    if(drawing_title!=="" && drawing_tag===""){
      showAlert("Warning", "Tag is required. Please try again!");
      return false;
    }
    
    if (drawing_title==="" || drawing_tag===""){
      showAlert("Warning", "Please enter the input data to save the drawing!");
      return false;
    }

    if (drawing_title.length<3){
      showAlert("Warning", "Title must be atleast 3 characters!");
      return false;
    }
        
    if (drawing_title.length>25){
      showAlert("Warning", "Title cannot be more than 25 characters!");
      return false;
    }

    if (!textRegex.test(drawing_title)){
      showAlert("Warning", "Title can only contain letters, numbers and single consecutive space!");
      return false;
    }
    
    if (drawing_tag.length<3){
      showAlert("Warning", "Tag must be atleast 3 characters!");
      return false;
    }
        
    if (drawing_tag.length>20){
      showAlert("Warning", "Tag cannot be more than 20 characters!");
      return false;
    }

    if (!textRegex.test(drawing_tag)){
      showAlert("Warning", "Tag can only contain letters, numbers and single consecutive space!");
      return false;
    }

    return true;
  }
  
  const handleSaveDrawing = async(e)=> {
    e.preventDefault();
    const canvas = canvasRef.current;
    const drawingURL = canvas.toDataURL("image/png");
    if (validateInputValue()){
      try{
        const response = await fetch("http://localhost:5000/api/drawing/drawing/savedrawing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
            drawing_title: inputValue.drawing_title.trim(),
            drawing_tag: inputValue.drawing_tag.trim(),
            drawing_url: drawingURL
          })
        });
        const json = await response.json();

        if(json.success){
          if (props.edit===true){
            handleEditedDrawingDelete();
          }
          showAlert("Success", "Your drawing looks awesome. It has been saved successfully!");
          navigate("/userviewdrawing");
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

  const addBorderHighlight = (type)=> {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type)=> {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }

  const handleEditedDrawingDelete = async()=> {
    try{
      const response = await fetch(`http://localhost:5000/api/drawing/drawing/deleteuserdrawing`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "_id": props.drawingid
      }
      });
      const json = await response.json();

      if(!json.success){
        showAlert("Error", json.error);
      }
    }catch(err){
      showAlert("Error", "Network error. Please check your connection or try again later!");
    }
  }

  return (
    <div className="auth-form-box">
      <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Save drawing</b></h1>
      <form className="auth-form">
        <div className="mb-1">
          <label htmlFor="drawing_title"><b>Title</b></label>
          <div className="input-bar" id="drawing-title-input-bar">
            <input type="text" id="drawing_title" name="drawing_title" placeholder="Enter title" value={inputValue.drawing_title} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("drawing-title")}} onBlur={()=>{removeBorderHighlight("drawing-title")}}/>
            <img src="/close.png" alt="close button image" onClick={() => {clearInput("drawing_title")}} style={{opacity: `${inputValue.drawing_title===""?0:1}`}}/>
          </div>
        </div>          
        <div style={{marginBottom: "28px"}}>
          <label htmlFor="drawing_tag"><b>Tag</b></label>
          <div className="input-bar" id="drawing-tag-input-bar">
            <input type="text" id="drawing_tag" name="drawing_tag" placeholder="Enter tag" value={inputValue.drawing_tag} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("drawing-tag")}} onBlur={()=>{removeBorderHighlight("drawing-tag")}}/>
            <img src="/close.png" alt="close button image" onClick={() => {clearInput("drawing_tag")}} style={{opacity: `${inputValue.drawing_tag===""?0:1}`}}/>
          </div>
        </div>
        <button type="submit" className="submit-btn" onClick={handleSaveDrawing}><b>Save drawing</b></button>
      </form>
    </div>
  )
}
