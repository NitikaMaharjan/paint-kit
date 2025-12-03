import { useContext, useState } from "react";
import AlertContext from "../context/alert/AlertContext";

export default function ChangePasswordForm(props) {

  const { showAlert } = useContext(AlertContext);
  
  const [credentials, setCredentials] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const updateInputValue = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value.trimStart()});
  }

  const clearInput = (input_field) => {
    setCredentials({...credentials, [input_field]: ""});
  }

  const changePasswordType = (type) => {
    if(type==="current_password"){
      currentPasswordType==="password"?setCurrentPasswordType("text"):setCurrentPasswordType("password");
    }else if(type==="new_password"){
      newPasswordType==="password"?setNewPasswordType("text"):setNewPasswordType("password");
    }else if(type==="confirm_password"){
      confirmPasswordType==="password"?setConfirmPasswordType("text"):setConfirmPasswordType("password");
    }
  }

  const addBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }

  const clientSideValidation = () => {
    const passwordRegex = /^[^\s]+$/;

    let trimmed_current_password = credentials.current_password.trim();
    let trimmed_new_password = credentials.new_password.trim();
    let trimmed_confirm_password = credentials.confirm_password.trim();

    if(trimmed_current_password==="" && trimmed_new_password!=="" && trimmed_confirm_password!==""){
      showAlert("Warning", "Current password is required. Please try again!");
      return false;
    }

    if(trimmed_current_password!=="" && trimmed_new_password==="" && trimmed_confirm_password!==""){
      showAlert("Warning", "New password is required. Please try again!");
      return false;
    }
    
    if(trimmed_current_password!=="" && trimmed_new_password!=="" && trimmed_confirm_password===""){
      showAlert("Warning", "Confirm password is required. Please try again!");
      return false;
    }
    
    if(trimmed_current_password==="" || trimmed_new_password==="" || trimmed_confirm_password===""){
      showAlert("Warning", "Please enter your credentials to change password!");
      return false;
    }
    
    if(trimmed_new_password.length<5){
      showAlert("Warning", "New password must be atleast 5 characters!");
      return false;
    }
    
    if(trimmed_new_password.length>10){
      showAlert("Warning", "New password cannot be more than 10 characters!");
      return false;
    }
    
    if(!passwordRegex.test(trimmed_new_password)){
      showAlert("Warning", "New password can only contain letters, numbers, and special characters. It cannot contain white spaces!");
      return false;
    }
    
    if(trimmed_new_password !== trimmed_confirm_password){
      showAlert("Warning", "New password and confirm password must match!");
      return false;
    }
    return true;
  }

  const handleUpdatePassword = async(e) => {
    e.preventDefault();
    if(clientSideValidation()){
      try{
        const response = await fetch(`${localStorage.getItem("adminSignedIn")?"http://localhost:5000/api/admin/admineditpassword":"http://localhost:5000/api/user/usereditpassword"}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("adminSignedIn")?localStorage.getItem("admin_id"):localStorage.getItem("user_id"),
            current_password: credentials.current_password.trim(),
            new_password: credentials.new_password.trim()
          })
        });
        const json = await response.json();
  
        if(json.success){
          props.setShowChangePasswordFormModal(false);
          showAlert("Success", "Your password is updated successfully!");
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
    <div className="content">
      <div className="auth-form-box">
        <div className="flex items-center justify-center" style={{borderBottom: "1px solid black", backgroundColor: "#ccc", width: "100%"}}>
            <h1 style={{fontSize: "14px", textAlign: "center", width: "86%", padding: "8px 0px", borderRight: "1px solid black"}}><b>Change password</b></h1>
            <div style={{marginLeft: "10px", cursor: "pointer"}} onClick={()=>{props.setShowChangePasswordFormModal(false)}}>
                <img src="/close.png" alt="close icon" style={{height: "14px", width: "14px"}}/>
            </div>
        </div>
        <form className="auth-form">        
            <div className="mb-1">
                <div className="flex items-center justify-between pr-1">
                    <label htmlFor="current_password"><b>Current password</b></label>
                    <img src={`/${currentPasswordType==="password"?"hide":"show"}.png`} alt="eye image" style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{changePasswordType("current_password")}}/>
                </div>
                <div className="input-bar" id="current-password-input-bar">
                    <input type={`${currentPasswordType}`} id="current_password" name="current_password" placeholder="Enter current password" value={credentials.current_password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("current-password")}} onBlur={()=>{removeBorderHighlight("current-password")}}/>
                    <img src="/close.png" alt="close button image" onClick={()=>{clearInput("current_password")}} style={{opacity: `${credentials.current_password===""?0:1}`}}/>
                </div>
            </div>
            <div className="mb-1">
                <div className="flex items-center justify-between pr-1">
                    <label htmlFor="new_password"><b>New password</b></label>
                    <img src={`/${newPasswordType==="password"?"hide":"show"}.png`} alt="eye image" style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{changePasswordType("new_password")}}/>
                </div>
                <div className="input-bar" id="new-password-input-bar">
                    <input type={`${newPasswordType}`} id="new_password" name="new_password" placeholder="Enter new password" value={credentials.new_password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("new-password")}} onBlur={()=>{removeBorderHighlight("new-password")}}/>
                    <img src="/close.png" alt="close button image" onClick={()=>{clearInput("new_password")}} style={{opacity: `${credentials.new_password===""?0:1}`}}/>
                </div>
            </div>
            <div style={{marginBottom: "28px"}}>
                <div className="flex items-center justify-between pr-1">
                    <label htmlFor="confirm_password"><b>Confirm password</b></label>
                    <img src={`/${confirmPasswordType==="password"?"hide":"show"}.png`} alt="eye image" style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{changePasswordType("confirm_password")}}/>
                </div>
                <div className="input-bar" id="confirm-password-input-bar">
                    <input type={`${confirmPasswordType}`} id="confirm_password" name="confirm_password" placeholder="Enter confirm password" value={credentials.confirm_password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("confirm-password")}} onBlur={()=>{removeBorderHighlight("confirm-password")}}/>
                    <img src="/close.png" alt="close button image" onClick={()=>{clearInput("confirm_password")}} style={{opacity: `${credentials.confirm_password===""?0:1}`}}/>
                </div>
            </div>
            <button type="submit" className="submit-btn" onClick={handleUpdatePassword}><b>Update password</b></button>
        </form>
      </div>
    </div>
  );
}