import { useState } from "react";

export default function AdminSignup() {
  
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: ""
  })

  const updateInputValue = (e)=> {
    setCredentials({...credentials, [e.target.name]: e.target.value});
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

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
      const response = await fetch("http://localhost:5000/api/auth/admin/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email, 
          username: credentials.username, 
          password: credentials.password
        })
      });
      const json = await response.json();

      if(json.success){
        alert("Your account is ready!" + json.authtoken);
      }else{
        alert(json.error);
      }
      
    }catch(err){
      alert("Network error. Please check your connection or try again later!")
    }
  }

  const addBorderHighlight = (type)=> {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type)=> {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }

  return (
    <div className="auth-form-box">
      <div className="flex justify-center gap-1">
        <img src="logo.png" style={{height: "28px", width: "28px"}}/>
        <h1 style={{fontSize: "14px", padding: "6px 0px 0px 0px"}}><b>Paint Kit</b></h1>
      </div>
      <h1 style={{margin: "12px 0px 14px 0px", fontSize: "15px", textAlign: "center"}}><b>Get started with your account</b></h1>
      <form className="auth-form">
        <div className="mb-1">
          <label htmlFor="email"><b>Email</b></label>
          <div className="input-bar" id="email-input-bar">
            <input type="email" id="email" name="email" placeholder="Enter email" value={credentials.email} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("email")}} onBlur={()=>{removeBorderHighlight("email")}}/>
            <img src="close.png" onClick={() => {clearInput("email")}} style={{opacity: `${credentials.email===""?0:1}`}}/>
          </div>
        </div>
        <div className="mb-1">
          <label htmlFor="username"><b>Username</b></label>
          <div className="input-bar" id="username-input-bar">
            <input type="text" id="username" name="username" placeholder="Enter username" value={credentials.username} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("username")}} onBlur={()=>{removeBorderHighlight("username")}}/>
            <img src="close.png" onClick={() => {clearInput("username")}} style={{opacity: `${credentials.username===""?0:1}`}}/>
          </div>
        </div>          
        <div className="mb-1">
          <div className="flex items-center justify-between pr-1">
            <label htmlFor="password"><b>Password</b></label>
            <img src={`${passwordType==="password"?"hide":"show"}.png`} style={{height: "16px", width: "16px"}} onClick={()=>{changePasswordType("password")}}/>
          </div>
          <div className="input-bar" id="password-input-bar">
            <input type={`${passwordType}`} id="password" name="password" placeholder="Enter password" value={credentials.password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("password")}} onBlur={()=>{removeBorderHighlight("password")}}/>
            <img src="close.png" onClick={() => {clearInput("password")}} style={{opacity: `${credentials.password===""?0:1}`}}/>
          </div>
        </div>
        <div style={{marginBottom: "28px"}}>
          <div className="flex items-center justify-between pr-1">
            <label htmlFor="confirm_password"><b>Confirm password</b></label>
            <img src={`${confirmPasswordType==="password"?"hide":"show"}.png`} style={{height: "16px", width: "16px"}} onClick={()=>{changePasswordType("confirm_password")}}/>
          </div>
          <div className="input-bar" id="confirm-password-input-bar">
            <input type={`${confirmPasswordType}`} id="confirm_password" name="confirm_password" placeholder="Enter confirm password" value={credentials.confirm_password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("confirm-password")}} onBlur={()=>{removeBorderHighlight("confirm-password")}}/>
            <img src="close.png" onClick={() => {clearInput("confirm_password")}} style={{opacity: `${credentials.confirm_password===""?0:1}`}}/>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <button type="submit" className="submit-btn" onClick={handleSubmit}><b>Sign up</b></button>
          <p style={{marginTop: "6px",textAlign: "center",fontSize: "13px"}}>Already have an account? <span style={{borderBottom: "1px solid black"}}>Sign in</span></p>
        </div>
      </form>
    </div>
  )
}
