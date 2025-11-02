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

  const giveMeDay = () => {
    let date_object = new Date();
    return date_object.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } 
    
  const giveMeTime = () => {
    let date_object = new Date();
    return date_object.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

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
      <div>
        <div className="flex items-center justify-between" style={{height: "40px", width: "100%", position: "fixed", top: "0", backgroundColor: "white", borderBottom: "1px solid #aaaaaa", padding: "4px 24px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)"}}>
          <h1 style={{fontSize: "15px"}}>Welcome back, {localStorage.getItem("admin_username")}!</h1>
          <p style={{fontSize: "13px"}}>{localStorage.getItem("admin_email")} <b>|</b> {giveMeDay()} <b>|</b> {giveMeTime()}</p>
          <button style={{fontSize: "13px", cursor: "pointer"}} onClick={handleSignOut}><b>Sign out</b></button>
        </div>
        <div className="side-navbar">
          <div style={{margin: "80px 0px 0px 40px", boxShadow: "3px 3px 0px rgba(0, 0, 0)", backgroundColor: "white", border: "1px solid black"}}>
            <div style={{padding: "7px 12px 5px 12px", backgroundColor: "#ccc", borderBottom: "1px solid black"}}>
              <h1 style={{fontSize: "15px"}}><b>Dashboard</b></h1>
            </div>
            <div className="flex flex-col">
              <button className="side-navbar-button" onClick={()=>{setShowAddTemplateFormModal(true)}}>Add Template</button>
              <Link className="side-navbar-button" to="/viewtemplate" target="_blank">View Template</Link>
              <button className="side-navbar-button" onClick={()=>{setShowCreateColorPaletteFormModal(true)}}>Create Color Palette</button>
              <Link className="side-navbar-button" to="/generatecolorpalette" target="_blank">Open color palette generator</Link>
            </div>
          </div>
        </div>
        <div className="dashboard-content">
          <AdminViewColorPalette/>
        </div>
      </div>
      
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
    </>
  );
}
