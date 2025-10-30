import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import AdminViewColorPalette from "../colorpalette/AdminViewColorPalette";
import AddTemplate from "../template/AddTemplate";
import CreateColorPalette from "../colorpalette/CreateColorPalette";

export default function AdminDashboard() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);

  const [showAddTemplateModal,setShowAddTemplateModal] = useState(false);
  const [showCreateColorPaletteModal,setShowCreateColorPaletteModal] = useState(false);

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
    <>
      <div className="content">
        <h1>Welcome, {localStorage.getItem("admin_username")}!</h1>
        <button className="confirm-btn" onClick={()=>{setShowAddTemplateModal(true)}}>Add Template</button>
        <Link className="confirm-btn" to="/viewtemplate">View template</Link>
        <Link className="confirm-btn" to="/generatecolorpalette" target="_blank">Open color palette generator</Link>
        <button className="confirm-btn" onClick={()=>{setShowCreateColorPaletteModal(true)}}>Create Color Palette</button>
        <button className="signout-btn" onClick={handleSignOut}><b>Sign out</b></button>
        <AdminViewColorPalette/>
      </div>
      {
        showAddTemplateModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowAddTemplateModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <AddTemplate setShowAddTemplateModal={setShowAddTemplateModal}/>
            </div>
        </div>
      }
      {
        showCreateColorPaletteModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowCreateColorPaletteModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <CreateColorPalette setShowCreateColorPaletteModal={setShowCreateColorPaletteModal}/>
            </div>
        </div>
      }
    </>
  )
}
