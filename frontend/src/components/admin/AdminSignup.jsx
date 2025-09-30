import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";

export default function AdminSignup() {

  let navigate = useNavigate();

  const { showAlert } = useContext(AlertContext);
  
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: ""
  })

  const updateInputValue = (e)=> {
    setCredentials({...credentials, [e.target.name]: e.target.value.trimStart()});
  }

  const clearInput = (input_field) => {
    setCredentials({...credentials, [input_field]: ""});
  }

  const changePasswordType = (type)=> {
    if(type==="password"){
      passwordType==="password"?setPasswordType("text"):setPasswordType("password");
    }else{
      confirmPasswordType==="password"?setConfirmPasswordType("text"):setConfirmPasswordType("password");
    }
  }

  const clientSideValidation = ()=> {
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-={};':"|,.<>/?]+$/;

    let trimmed_email = credentials.email.trim().toLowerCase();
    let trimmed_username = credentials.username.trim();
    let trimmed_password = credentials.password.trim();
    let trimmed_confirm_password = credentials.confirm_password.trim();

    if(trimmed_email==="" && trimmed_username!=="" && trimmed_password!=="" && trimmed_confirm_password!==""){
      showAlert("Warning", "Email is required. Please try again!");
      return false;
    }
    
    if(trimmed_email!=="" && trimmed_username==="" && trimmed_password!=="" && trimmed_confirm_password!==""){
      showAlert("Warning", "Username is required. Please try again!");
      return false;
    }
    
    if(trimmed_email!=="" && trimmed_username!=="" && trimmed_password==="" && trimmed_confirm_password!==""){
      showAlert("Warning", "Password is required. Please try again!");
      return false;
    }
    
    if(trimmed_email!=="" && trimmed_username!=="" && trimmed_password!=="" && trimmed_confirm_password===""){
      showAlert("Warning", "Confirm Password is required. Please try again!");
      return false;
    }
    
    if (trimmed_email==="" || trimmed_username==="" || trimmed_password==="" || trimmed_confirm_password===""){
      showAlert("Warning", "Please enter your credentials to sign up!");
      return false;
    }
    
    if(!document.getElementById("email").checkValidity()){
      showAlert("Warning", "Please enter a valid email address!");
      return false;
    }
    
    if (trimmed_username.length<3){
      showAlert("Warning", "Username must be atleast 3 characters!");
      return false;
    }
    
    if (trimmed_username.length>25){
      showAlert("Warning", "Username cannot be more than 25 characters!");
      return false;
    }
    
    if (!nameRegex.test(trimmed_username)){
      showAlert("Warning", "Username can only contain letters and single consecutive space!");
      return false;
    }
    
    if (trimmed_password.length<5){
      showAlert("Warning", "Password must be atleast 5 characters!");
      return false;
    }
    
    if (trimmed_password.length>10){
      showAlert("Warning", "Password cannot be more than 10 characters!");
      return false;
    }
    
    if (!passwordRegex.test(trimmed_password)){
      showAlert("Warning", "Password can only contain letters, numbers, and special characters!");
      return false;
    }
    
    if (trimmed_password !== trimmed_confirm_password){
      showAlert("Warning", "Password and confirm password must match!");
      return false;
    }
    return true;
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(clientSideValidation()){
      try{
        const response = await fetch("http://localhost:5000/api/auth/admin/adminsignup", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email.trim().toLowerCase(), 
            username: credentials.username.trim(),
            password: credentials.password.trim()
          })
        });
        const json = await response.json();
  
        if(json.success){
          navigate("/adminsignin");
          showAlert("Success", "Your account is ready!");
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

  return (
    <div className="content">
      <div className="auth-form-box">
        <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Get started with your account</b></h1>
        <form className="auth-form">
          <div className="mb-1">
            <label htmlFor="email"><b>Email</b></label>
            <div className="input-bar" id="email-input-bar">
              <input type="email" id="email" name="email" placeholder="Enter email" value={credentials.email} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("email")}} onBlur={()=>{removeBorderHighlight("email")}}/>
              <img src="close.png" alt="close button image" onClick={() => {clearInput("email")}} style={{opacity: `${credentials.email===""?0:1}`}}/>
            </div>
          </div>
          <div className="mb-1">
            <label htmlFor="username"><b>Username</b></label>
            <div className="input-bar" id="username-input-bar">
              <input type="text" id="username" name="username" placeholder="Enter username" value={credentials.username} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("username")}} onBlur={()=>{removeBorderHighlight("username")}}/>
              <img src="close.png" alt="close button image" onClick={() => {clearInput("username")}} style={{opacity: `${credentials.username===""?0:1}`}}/>
            </div>
          </div>          
          <div className="mb-1">
            <div className="flex items-center justify-between pr-1">
              <label htmlFor="password"><b>Password</b></label>
              <img src={`${passwordType==="password"?"hide":"show"}.png`} alt="eye image" style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{changePasswordType("password")}}/>
            </div>
            <div className="input-bar" id="password-input-bar">
              <input type={`${passwordType}`} id="password" name="password" placeholder="Enter password" value={credentials.password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("password")}} onBlur={()=>{removeBorderHighlight("password")}}/>
              <img src="close.png" alt="close button image" onClick={() => {clearInput("password")}} style={{opacity: `${credentials.password===""?0:1}`}}/>
            </div>
          </div>
          <div style={{marginBottom: "28px"}}>
            <div className="flex items-center justify-between pr-1">
              <label htmlFor="confirm_password"><b>Confirm password</b></label>
              <img src={`${confirmPasswordType==="password"?"hide":"show"}.png`} alt="eye image" style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{changePasswordType("confirm_password")}}/>
            </div>
            <div className="input-bar" id="confirm-password-input-bar">
              <input type={`${confirmPasswordType}`} id="confirm_password" name="confirm_password" placeholder="Enter confirm password" value={credentials.confirm_password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("confirm-password")}} onBlur={()=>{removeBorderHighlight("confirm-password")}}/>
              <img src="close.png" alt="close button image" onClick={() => {clearInput("confirm_password")}} style={{opacity: `${credentials.confirm_password===""?0:1}`}}/>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <button type="submit" className="submit-btn" onClick={handleSubmit}><b>Sign up</b></button>
            <p style={{marginTop: "6px",textAlign: "center",fontSize: "13px"}}>Already have an account? <Link to="/adminsignin" style={{borderBottom: "1px solid black"}}>Sign in</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}
