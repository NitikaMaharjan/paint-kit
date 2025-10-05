import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import AdminViewColorPalette from "./AdminViewColorPalette";

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
      localStorage.removeItem("admin_id");
      localStorage.removeItem("admin_email");
      localStorage.removeItem("admin_username");
      navigate("/adminsignin");
      showAlert("Success", "You've signed out. See you next time!");
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
    <div className="content">
      <h1>Welcome, {localStorage.getItem("admin_username")}!</h1>
      <Link to="/createcolorpalette" className="add-color-btn">Create Color Palette</Link>
      <button className="signout-btn" onClick={handleSignOut}><b>Sign out</b></button>
      <AdminViewColorPalette/>
    </div>
  )
}
