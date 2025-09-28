import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignedInUserDetailsContext from "../../context/user/SignedInUserDetailsContext";

export default function UserSignin() {

  let navigate = useNavigate();

  const { fetchSignedInUserDetails } = useContext(SignedInUserDetailsContext);
  
  const [passwordType, setPasswordType] = useState("password");
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  const updateInputValue = (e)=> {
    setCredentials({...credentials, [e.target.name]: e.target.value.trim()});
  }

  const clearInput = (input_field) => {
    setCredentials({...credentials, [input_field]: ""});
  }

  const changePasswordType = ()=> {
    passwordType==="password"?setPasswordType("text"):setPasswordType("password");
  }

  const clientSideValidation = ()=> {
    let email = credentials.email;
    let password = credentials.password;

    if(email==="" && password!==""){
      alert("Email is required. Please try again!");
      return false;
    }
    
    if(email!=="" && password===""){
      alert("Password is required. Please try again!");
      return false;
    }
    
    if (email==="" || password===""){
      alert("Please enter your credentials to sign in!");
      return false;
    }
    
    if(!document.getElementById("email").checkValidity()){
      alert("Please enter a valid email address!");
      return false;
    }
    return true;
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(clientSideValidation()){
      try{
        const response = await fetch("http://localhost:5000/api/auth/user/usersignin", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });
        const json = await response.json();
  
        if(json.success){
          localStorage.setItem("userSignedIn", "true");
          localStorage.setItem("userAuthToken", json.authtoken);
          await fetchSignedInUserDetails();
          if(localStorage.getItem("user_token")){
            navigate("/userhome");
            alert("You've signed in. Welcome back!");
          }
        }else{
          if(json.error){
            alert(json.error);
          }          
          if(json.errors){
            alert(json.errors.map(err => err.msg).join("\n")+"\nPlease try again!");
          }
        }
      }catch(err){
        alert("Network error. Please check your connection or try again later!")
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
    <>
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
              <input type="email" id="email" name="email" placeholder="Enter email" value={credentials.email} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("email")}} onBlur={()=>{removeBorderHighlight("email")}}/>
              <img src="close.png" onClick={() => {clearInput("email")}} style={{opacity: `${credentials.email===""?0:1}`}}/>
            </div>
          </div>          
          <div style={{marginBottom: "28px"}}>
            <div className="flex items-center justify-between pr-1">
              <label htmlFor="password"><b>Password</b></label>
              <img src={`${passwordType==="password"?"hide":"show"}.png`} style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{changePasswordType()}}/>
            </div>
            <div className="input-bar" id="password-input-bar">
              <input type={`${passwordType}`} id="password" name="password" placeholder="Enter password" value={credentials.password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("password")}} onBlur={()=>{removeBorderHighlight("password")}}/>
              <img src="close.png" onClick={() => {clearInput("password")}} style={{opacity: `${credentials.password===""?0:1}`}}/>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <button type="submit" className="submit-btn" onClick={handleSubmit}><b>Sign in</b></button>
            <p style={{marginTop: "6px",textAlign: "center",fontSize: "13px"}}>Don't have an account? <Link to="/usersignup" style={{borderBottom: "1px solid black"}}>Sign up</Link></p>
          </div>
        </form>
      </div>
    </>
  )
}
