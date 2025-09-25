import { useState } from "react";

export default function AdminSignin() {
  
  const [passwordType, setPasswordType] = useState("password");
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  const updateInputValue = (e)=> {
    setCredentials({...credentials, [e.target.name]: e.target.value});
  }

  const clearInput = (input_field) => {
    setCredentials({...credentials, [input_field]: ""});
  }

  const changePasswordType = ()=> {
    passwordType==="password"?setPasswordType("text"):setPasswordType("password");
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try{
      const response = await fetch("http://localhost:5000/api/auth/admin/signin", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: credentials.email, 
          password: credentials.password
        })
      });
      const json = await response.json();

      if(json.success){
        alert("You've signed in. Welcome back!" + json.authtoken);
        localStorage.setItem("adminSignedIn", "true");
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
  
  const handleSignOut = ()=> {
    let ans = window.confirm("Are you sure?");
    if (ans) {
      localStorage.removeItem("adminSignedIn");
      alert("You've signed out. See you next time!");
    }
  }

  return (
    <>
      {
        localStorage.getItem("adminSignedIn")?
          <button style={{position: "fixed", top: "32px", right: "32px"}} onClick={handleSignOut}><b>Sign out</b></button>
          :
          <></>
      }
      <div className="auth-form-box">
        <div className="flex justify-center gap-1">
          <img src="logo.png" style={{height: "28px", width: "28px"}}/>
          <h1 style={{fontSize: "14px", padding: "6px 0px 0px 0px"}}><b>Paint Kit</b></h1>
        </div>
        <h1 style={{margin: "12px 0px 14px 0px", fontSize: "15px", textAlign: "center"}}><b>Welcome back</b></h1>
        <form className="auth-form">
          <div className="mb-1">
            <label htmlFor="email"><b>Email</b></label>
            <div className="input-bar" id="email-input-bar">
              <input type="text" id="email" name="email" placeholder="Enter email" value={credentials.email} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("email")}} onBlur={()=>{removeBorderHighlight("email")}}/>
              <img src="close.png" onClick={() => {clearInput("email")}} style={{opacity: `${credentials.email===""?0:1}`}}/>
            </div>
          </div>          
          <div style={{marginBottom: "28px"}}>
            <div className="flex items-center justify-between pr-1">
              <label htmlFor="password"><b>Password</b></label>
              <img src={`${passwordType==="password"?"hide":"show"}.png`} style={{height: "16px", width: "16px"}} onClick={()=>{changePasswordType()}}/>
            </div>
            <div className="input-bar" id="password-input-bar">
              <input type={`${passwordType}`} id="password" name="password" placeholder="Enter password" value={credentials.password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("password")}} onBlur={()=>{removeBorderHighlight("password")}}/>
              <img src="close.png" onClick={() => {clearInput("password")}} style={{opacity: `${credentials.password===""?0:1}`}}/>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <button type="submit" className="submit-btn" onClick={handleSubmit}><b>Sign in</b></button>
            <p style={{marginTop: "6px",textAlign: "center",fontSize: "13px"}}>Don't have an account? <span style={{borderBottom: "1px solid black"}}>Sign up</span></p>
          </div>
        </form>
      </div>
    </>
  )
}
