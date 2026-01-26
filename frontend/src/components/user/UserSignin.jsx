import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import SignedInUserDetailsContext from "../../context/user/SignedInUserDetailsContext";

export default function UserSignin(props) {

  let navigate = useNavigate();

  const { showAlert } = useContext(AlertContext);
  const { fetchSignedInUserDetails } = useContext(SignedInUserDetailsContext);
  
  const [credentials, setCredentials] = useState({
    user_email: "",
    user_password: ""
  });
  const [passwordType, setPasswordType] = useState("password");

  const updateInputValue = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value.trim()});
  }

  const clearInput = (input_field) => {
    setCredentials({...credentials, [input_field]: ""});
  }

  const changePasswordType = () => {
    passwordType==="password"?setPasswordType("text"):setPasswordType("password");
  }

  const addBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }

  const clientSideValidation = () => {
    let email = credentials.user_email;
    let password = credentials.user_password;

    if(email==="" && password!==""){
      showAlert("Warning", "Email is required. Please try again!");
      return false;
    }
    
    if(email!=="" && password===""){
      showAlert("Warning", "Password is required. Please try again!");
      return false;
    }
    
    if(email==="" || password===""){
      showAlert("Warning", "Please enter your credentials to sign in!");
      return false;
    }
    
    if(!document.getElementById("user_email").checkValidity()){
      showAlert("Warning", "Please enter a valid email address!");
      return false;
    }
    return true;
  }

  const handleSignIn = async(e) => {
    e.preventDefault();
    if(clientSideValidation()){
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/usersignin`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            user_email: credentials.user_email,
            user_password: credentials.user_password
          })
        });
        const json = await response.json();
  
        if(json.success){
          localStorage.setItem("userSignedIn", "true");
          localStorage.setItem("userAuthToken", json.authtoken);
          await fetchSignedInUserDetails();
          if(localStorage.getItem("user_token")){
            navigate("/userhome");
            showAlert("Success", "You've signed in. Welcome back!");
          }
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
        <div className="flex items-center justify-center" style={{borderBottom: "1px solid black", backgroundColor: "#cccccc", width: "100%"}}>
          {
            props.popup ?
              <>
                <h1 style={{fontSize: "14px", textAlign: "center", width: "86%", padding: "8px 0px", borderRight: "1px solid black"}}><b>Sign in to continue</b></h1>
                <div style={{marginLeft: "10px", cursor: "pointer"}} onClick={()=>{props.setShowUserSigninFormModal(false)}}>
                  <img src="/close.png" alt="close icon" style={{height: "14px", width: "14px"}}/>
                </div>
              </>
            :
              <>
                <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center"}}><b>Welcome back</b></h1>
              </>
          }
        </div>
        <form className="auth-form">
          <div className="mb-1">
            <label htmlFor="user_email"><b>Email</b></label>
            <div className="input-bar" id="email-input-bar">
              <input type="email" id="user_email" name="user_email" placeholder="Enter email" value={credentials.user_email} onChange={updateInputValue} autoComplete="on" onFocus={()=>{addBorderHighlight("email")}} onBlur={()=>{removeBorderHighlight("email")}}/>
              <img src="/close.png" alt="close icon" onClick={()=>{clearInput("user_email")}} style={{opacity: `${credentials.user_email===""?"0":"1"}`}}/>
            </div>
          </div>          
          <div style={{marginBottom: "28px"}}>
            <div className="flex items-center justify-between pr-1">
              <label htmlFor="user_password"><b>Password</b></label>
              <img src={`/${passwordType==="password"?"hide":"show"}.png`} alt="eye icon" style={{height: "16px", width: "16px", cursor: "pointer"}} onClick={()=>{changePasswordType()}}/>
            </div>
            <div className="input-bar" id="password-input-bar">
              <input type={`${passwordType}`} id="user_password" name="user_password" placeholder="Enter password" value={credentials.user_password} onChange={updateInputValue} onFocus={()=>{addBorderHighlight("password")}} onBlur={()=>{removeBorderHighlight("password")}}/>
              <img src="/close.png" alt="close icon" onClick={()=>{clearInput("user_password")}} style={{opacity: `${credentials.user_password===""?"0":"1"}`}}/>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <button type="submit" className="submit-button" onClick={handleSignIn}><b>Sign in</b></button>
            <p style={{marginTop: "6px",textAlign: "center",fontSize: "13px"}}>Don't have an account? <Link to="/usersignup" style={{borderBottom: "1px solid black"}}>Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}