import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";

export default function UserHome() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);

  const handleSignOut = async()=> {
    let ans = await showConfirm("Sign out");
    if (ans) {
      localStorage.removeItem("userSignedIn");
      localStorage.removeItem("userAuthToken");
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_username");
      navigate("/usersignin");
      showAlert("#28a745", "Success", "You've signed out. See you next time!");
    }
  }

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
      navigate("/usersignin");
    }else{
      showProgress();
    }
    // eslint-disable-next-line
  }, []);  

  return (
    <>
      <h1>Welcome, {localStorage.getItem("user_username")}!</h1>
      <button className="signout-btn" onClick={handleSignOut}><b>Sign out</b></button>
    </>
  )
}
