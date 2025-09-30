import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";

export default function AdminDashboard() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);

  const handleSignOut = async()=> {
    let ans = await showConfirm("Sign out");
    if (ans) {
      localStorage.removeItem("adminSignedIn");
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_email");
      localStorage.removeItem("admin_username");
      navigate("/adminsignin");
      showAlert("#28a745", "Success", "You've signed out. See you next time!");
    }
  }

  useEffect(() => {
    if(!localStorage.getItem("adminSignedIn") && !localStorage.getItem("admin_token")){
      navigate("/adminsignin");
    }else{
      showProgress();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h1>Welcome, {localStorage.getItem("admin_username")}!</h1>
      <button className="signout-btn" onClick={handleSignOut}><b>Sign out</b></button>
    </>
  )
}
