import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";

export default function UserHome() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);

  const handleSignOut = ()=> {
    let ans = window.confirm("Are you sure?");
    if (ans) {
      localStorage.removeItem("userSignedIn");
      localStorage.removeItem("userAuthToken");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_username");
      navigate("/usersignin");
      alert("You've signed out. See you next time!");
    }
  }

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn")){
      navigate("/usersignin");
    }else{
      showProgress();
    }
    // eslint-disable-next-line
  }, []);  

  return (
    <>
      <h1>Welcome, {localStorage.getItem("user_username")}!</h1>
      <button style={{position: "fixed", top: "32px", right: "32px"}} onClick={handleSignOut}><b>Sign out</b></button>
    </>
  )
}
