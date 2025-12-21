import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AdminTopNavbar from "../navbar/AdminTopNavbar";
import ViewTemplate from "../template/ViewTemplate";
import AddTemplateForm from "../template/AddTemplateForm";
import AdminViewColorPalette from "../colorpalette/AdminViewColorPalette";
import GenerateColorPalette from "../colorpalette/GenerateColorPalette";
import CreateColorPaletteForm from "../colorpalette/CreateColorPaletteForm";

export default function AdminDashboard() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);

  const [selectedContent, setSelectedContent] = useState(localStorage.getItem("adminContentChoice"));
  const [showAddTemplateFormModal,setShowAddTemplateFormModal] = useState(false);
  const [showGenerateColorPaletteModal,setShowGenerateColorPaletteModal] = useState(false);
  const [showCreateColorPaletteFormModal,setShowCreateColorPaletteFormModal] = useState(false);

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
      <div className="admin-left-navbar">
        <div style={{margin: "20px 40px 0px 20px", backgroundColor: "white", border: "1px solid black", boxShadow: "3px 3px 0px rgba(0, 0, 0)"}}>
          <div style={{padding: "10px", backgroundColor: "#ccc", borderBottom: "1px solid black"}}>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="logo" style={{height: "24px"}}/>
              <h1 style={{fontSize: "14px", marginTop: "2px"}}><b>Paint Kit</b></h1>
            </div>
          </div>
          <div className="flex flex-col" style={{padding: "6px"}}>
            <button className={`admin-left-navbar-button ${selectedContent==="template"?"selected":"not-selected"}`} onClick={()=>{localStorage.setItem("adminContentChoice", "template");setSelectedContent(localStorage.getItem("adminContentChoice"));}}>Template</button>
            <button className={`admin-left-navbar-button ${selectedContent==="colorpalette"?"selected":"not-selected"}`} onClick={()=>{localStorage.setItem("adminContentChoice", "colorpalette");setSelectedContent(localStorage.getItem("adminContentChoice"));}}>Color Palette</button>
          </div>
        </div>
      </div>
      
      <AdminTopNavbar/>

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
            <button className="action-btn" onClick={()=>{setShowGenerateColorPaletteModal(true)}}>Open color palette generator</button>
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
        showGenerateColorPaletteModal
        &&
        <div className="confirm-modal-background">
          <GenerateColorPalette setShowGenerateColorPaletteModal={setShowGenerateColorPaletteModal}/>
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