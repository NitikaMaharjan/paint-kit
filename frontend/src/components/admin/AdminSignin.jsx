import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import SignedInAdminDetailsContext from "../../context/admin/SignedInAdminDetailsContext";

export default function AdminSignin() {

  let navigate = useNavigate();

  const { showAlert } = useContext(AlertContext);
  const { fetchSignedInAdminDetails } = useContext(SignedInAdminDetailsContext);
  
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
      showAlert("#ffd000d3", "Validation error", "Email is required. Please try again!");
      return false;
    }
    
    if(email!=="" && password===""){
      showAlert("#ffd000d3", "Validation error", "Password is required. Please try again!");
      return false;
    }
    
    if (email==="" || password===""){
      showAlert("#ffd000d3", "Validation error", "Please enter your credentials to sign in!");
      return false;
    }
    
    if(!document.getElementById("email").checkValidity()){
      showAlert("#ffd000d3", "Validation error", "Please enter a valid email address!");
      return false;
    }
    return true;
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(clientSideValidation()){
      try{
        const response = await fetch("http://localhost:5000/api/auth/admin/adminsignin", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });
        const json = await response.json();
  
        if(json.success){
          localStorage.setItem("adminSignedIn", "true");
          localStorage.setItem("adminAuthToken", json.authtoken);
          await fetchSignedInAdminDetails();
          if(localStorage.getItem("admin_token")){
            navigate("/admindashboard");
            showAlert("#32ad53ec", "Signed in", "You've signed in. Welcome back!");
          }
        }else{
          if(json.error){
            showAlert("#d64242e0", "Server error", json.error);
          }          
          if(json.errors){
            showAlert("#d64242e0", "Server error", json.errors.map(err => err.msg).join("\n")+"\nPlease try again!");
          }
        }
      }catch(err){
        showAlert("#d64242e0", "Server error", "Network error. Please check your connection or try again later!")
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
      {
        localStorage.getItem("adminSignedIn")?
          <button style={{position: "fixed", top: "32px", right: "32px"}} onClick={handleSignOut}><b>Sign out</b></button>
          :
          <></>
      }
      <div className="auth-form-box">
        <h1 style={{padding: "8px 24px 8px 24px", fontSize: "14px", textAlign: "left", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Welcome back</b></h1>
        <form className="auth-form">
          <div className="mb-1">
            <label htmlFor="email"><b>Email</b></label>
            <div className="input-bar" id="email-input-bar">
              <input type="email" id="email" name="email" placeholder="Enter email" value={credentials.email} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("email")}} onBlur={()=>{removeBorderHighlight("email")}}/>
              <img src="close.png" alt="close button image" onClick={() => {clearInput("email")}} style={{opacity: `${credentials.email===""?0:1}`}}/>
            </div>
          </div>          
          <div style={{marginBottom: "28px"}}>
            <div className="flex items-center justify-between pr-1">
              <label htmlFor="password"><b>Password</b></label>
              <img src={`${passwordType==="password"?"hide":"show"}.png`} alt="eye image" style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{changePasswordType()}}/>
            </div>
            <div className="input-bar" id="password-input-bar">
              <input type={`${passwordType}`} id="password" name="password" placeholder="Enter password" value={credentials.password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("password")}} onBlur={()=>{removeBorderHighlight("password")}}/>
              <img src="close.png" alt="close button image" onClick={() => {clearInput("password")}} style={{opacity: `${credentials.password===""?0:1}`}}/>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <button type="submit" className="submit-btn" onClick={handleSubmit}><b>Sign in</b></button>
            <p style={{marginTop: "6px",textAlign: "center",fontSize: "13px"}}>Don't have an account? <Link to="/adminsignup" style={{borderBottom: "1px solid black"}}>Sign up</Link></p>
          </div>
        </form>
      </div>
    </>
  )
}
