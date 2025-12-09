import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import CreateColorPaletteForm from "../colorpalette/CreateColorPaletteForm";
import AdminViewColorPalette from "../colorpalette/AdminViewColorPalette";
import AddTemplateForm from "../template/AddTemplateForm";
import ViewTemplate from "../template/ViewTemplate";
import ChangePasswordForm from "../ChangePasswordForm";

export default function AdminDashboard() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);

  const [showSettingDropDown, setShowSettingDropDown] = useState(false);
  const [selectedContent, setSelectedContent] = useState("template");
  const [showCreateColorPaletteFormModal,setShowCreateColorPaletteFormModal] = useState(false);
  const [showAddTemplateFormModal,setShowAddTemplateFormModal] = useState(false);
  const [showChangePasswordFormModal, setShowChangePasswordFormModal] = useState(false);

  const handleMouseOver = () => {
    document.getElementById("arrow").style.backgroundColor="rgba(0, 0, 0, 0.05)";
  }
    
  const handleMouseOut = () => {
    document.getElementById("arrow").style.backgroundColor="transparent";
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
      <div className="flex items-center justify-between" style={{height: "40px", width: "100%", position: "fixed", top: "0", backgroundColor: "white", padding: "4px 40px"}}>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" style={{height: "24px"}}/>
          <h1 style={{fontSize: "14px", marginTop: "2px"}}><b>Paint Kit</b></h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center" style={{border: "1px solid rgba(0, 0, 0, 0.8)", height: "19px", width: "19px", borderRadius: "18px"}}>
            <img src="/user.png" alt="user icon" style={{height: "13px", width: "13px"}}/>
          </div>&nbsp;
          <p style={{fontSize: "13px"}}>{localStorage.getItem("admin_username")}</p>&nbsp;
          <p style={{fontSize: "13px"}}><b>|</b> {localStorage.getItem("admin_email")}</p>&nbsp;
          <div>
            <div id="arrow" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{padding: "4px"}}>
              <button className="dropdown-btn" onClick={()=>{setShowSettingDropDown(!showSettingDropDown)}}><img src="/down-arrow.png" alt="down arrow icon" style={{height: "14px", width: "14px"}}/></button>
            </div>
            {
              showSettingDropDown
              &&
              <div className="dropdown-content">
                  <button className="dropdown-content-button" onClick={()=>{setShowChangePasswordFormModal(true);setShowSettingDropDown(!showSettingDropDown);}}>Change password</button>
                  <button className="dropdown-content-button" onClick={()=>{handleSignOut();setShowSettingDropDown(!showSettingDropDown);}}>Sign out</button>
              </div>
            }
          </div>
        </div>
      </div>

      <div className="side-navbar">
        <div style={{margin: "80px 40px 0px 40px", backgroundColor: "white", border: "1px solid black", boxShadow: "3px 3px 0px rgba(0, 0, 0)"}}>
          <div style={{padding: "10px", backgroundColor: "#ccc", borderBottom: "1px solid black"}}>
            <h1 style={{fontSize: "14px"}}><b>Dashboard</b></h1>
          </div>
          <div className="flex flex-col" style={{padding: "6px"}}>
            <button className={`side-navbar-button ${selectedContent==="template"?"selected":"not-selected"}`} onClick={()=>{setSelectedContent("template")}}>Template</button>
            <button className={`side-navbar-button ${selectedContent==="colorpalette"?"selected":"not-selected"}`} onClick={()=>{setSelectedContent("colorpalette")}}>Color Palette</button>
          </div>
        </div>
      </div>

      {
        selectedContent==="template"
        &&
        <div className="dashboard-content">          
          <ViewTemplate/>          
          <div className="flex justify-center mt-3">
            <button className="action-btn" onClick={()=>{setShowAddTemplateFormModal(true)}}>Add Template</button>
          </div>
        </div>
      }
        
      {
        selectedContent==="colorpalette"
        &&
        <div className="dashboard-content">          
          <AdminViewColorPalette/>
          <div className="flex justify-center mt-3 gap-8">
            <Link className="action-btn" to="/generatecolorpalette" target="_blank">Open color palette generator</Link>
            <button className="action-btn" onClick={()=>{setShowCreateColorPaletteFormModal(true)}}>Create color palette</button>
          </div>
        </div>
      }
      
      {
        showAddTemplateFormModal
        &&
        <div className="confirm-modal-background">
          <AddTemplateForm setShowAddTemplateFormModal={setShowAddTemplateFormModal}/>
        </div>
      }

      {
        showCreateColorPaletteFormModal
        &&
        <div className="confirm-modal-background">
          <CreateColorPaletteForm setShowCreateColorPaletteFormModal={setShowCreateColorPaletteFormModal}/>
        </div>
      }

      {
        showChangePasswordFormModal
        &&
        <div className="confirm-modal-background">
            <ChangePasswordForm setShowChangePasswordFormModal={setShowChangePasswordFormModal}/>
        </div>
      }
    </>
  );
}