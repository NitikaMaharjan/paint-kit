import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import CreateColorPaletteForm from "../colorpalette/CreateColorPaletteForm";
import AdminViewColorPalette from "../colorpalette/AdminViewColorPalette";
import AddTemplateForm from "../template/AddTemplateForm";

export default function AdminDashboard() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);

  const [showCreateColorPaletteFormModal,setShowCreateColorPaletteFormModal] = useState(false);
  const [showAddTemplateFormModal,setShowAddTemplateFormModal] = useState(false);

  const handleSignOut = async() => {
    let ans = await showConfirm("Sign out");
    if(ans){
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
        <button className="confirm-btn" onClick={()=>{setShowCreateColorPaletteFormModal(true)}}>Create Color Palette</button>
        <Link className="confirm-btn" to="/generatecolorpalette" target="_blank">Open color palette generator</Link>
        <AdminViewColorPalette/>
        <button className="confirm-btn" onClick={()=>{setShowAddTemplateFormModal(true)}}>Add Template</button>
        <Link className="confirm-btn" to="/viewtemplate">View template</Link>
        <button className="signout-btn" onClick={handleSignOut}><b>Sign out</b></button>
      </div>

      {
        showCreateColorPaletteFormModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowCreateColorPaletteFormModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <CreateColorPaletteForm setShowCreateColorPaletteFormModal={setShowCreateColorPaletteFormModal}/>
            </div>
        </div>
      }

      {
        showAddTemplateFormModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowAddTemplateFormModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <AddTemplateForm setShowAddTemplateFormModal={setShowAddTemplateFormModal}/>
            </div>
        </div>
      }
    </>
  );
}
