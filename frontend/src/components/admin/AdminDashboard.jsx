import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import CreateColorPaletteForm from "../colorpalette/CreateColorPaletteForm";
import AdminViewColorPalette from "../colorpalette/AdminViewColorPalette";
import AddTemplateForm from "../template/AddTemplateForm";
import ViewTemplate from "../template/ViewTemplate";
import TopNavbar from "../navbar/TopNavbar";

export default function AdminDashboard() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);

  const [selectedContent, setSelectedContent] = useState(localStorage.getItem("adminContentChoice"));
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
      localStorage.removeItem("adminContentChoice");
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
      <TopNavbar username={localStorage.getItem("admin_username")} email={localStorage.getItem("admin_email")} handleSignOut={handleSignOut}/>

      <div className="side-navbar">
        <div style={{margin: "80px 40px 0px 40px", backgroundColor: "white", border: "1px solid black", boxShadow: "3px 3px 0px rgba(0, 0, 0)"}}>
          <div style={{padding: "10px", backgroundColor: "#ccc", borderBottom: "1px solid black"}}>
            <h1 style={{fontSize: "14px"}}><b>Dashboard</b></h1>
          </div>
          <div className="flex flex-col" style={{padding: "6px"}}>
            <button className={`side-navbar-button ${selectedContent==="template"?"selected":"not-selected"}`} onClick={()=>{localStorage.setItem("adminContentChoice", "template");setSelectedContent(localStorage.getItem("adminContentChoice"));}}>Template</button>
            <button className={`side-navbar-button ${selectedContent==="colorpalette"?"selected":"not-selected"}`} onClick={()=>{localStorage.setItem("adminContentChoice", "colorpalette");setSelectedContent(localStorage.getItem("adminContentChoice"));}}>Color Palette</button>
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
    </>
  );
}