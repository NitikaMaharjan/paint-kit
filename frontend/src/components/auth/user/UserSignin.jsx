import { useState } from "react";

export default function UserSignin() {
  
  const [passwordType, setPasswordType] = useState("password");
  const [credentials, setCredentials] = useState({
    username: "",
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

  return (
    <div className="auth-form-box">
      <div className="flex justify-center gap-1">
        <img src="logo.png" style={{height: "28px", width: "28px"}}/>
        <h1 style={{fontSize: "14px", padding: "6px 0px 0px 0px"}}><b>Paint Kit</b></h1>
      </div>
      <h1 style={{margin: "12px 0px 14px 0px", fontSize: "15px", textAlign: "center"}}><b>Welcome back</b></h1>
      <form className="auth-form">
        <div className="mb-1">
          <label htmlFor="username"><b>Username</b></label>
          <div className="input-bar">
            <input type="text" id="username" name="username" placeholder="Enter username" value={credentials.username} onChange={updateInputValue} autoComplete="on"/>
            <img src="close.png" onClick={() => {clearInput("username")}} style={{opacity: `${credentials.username===""?0:1}`}}/>
          </div>
        </div>          
        <div style={{marginBottom: "28px"}}>
          <div className="flex items-center justify-between pr-1">
            <label htmlFor="password"><b>Password</b></label>
            <img src={`${passwordType==="password"?"hide":"show"}.png`} style={{height: "16px", width: "16px"}} onClick={()=>{changePasswordType()}}/>
          </div>
          <div className="input-bar">
            <input type={`${passwordType}`} id="password" name="password" placeholder="Enter password" value={credentials.password} onChange={updateInputValue}/>
            <img src="close.png" onClick={() => {clearInput("password")}} style={{opacity: `${credentials.password===""?0:1}`}}/>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <button type="submit" className="submit-btn"><b>Sign in</b></button>
          <p style={{marginTop: "6px",textAlign: "center",fontSize: "13px"}}>Don't have an account? <span style={{borderBottom: "1px solid black"}}>Sign up</span></p>
        </div>
      </form>
    </div>
  )
}
