import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import TemplateContext from "../../context/template/TemplateContext";
import EditTemplateForm from "../template/EditTemplateForm";

export default function DrawingItem(props) {

  const { _id, template_title, template_tag, template_url, template_updated_date } = props.templateInfo;

  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);
  const { fetchTemplate } = useContext(TemplateContext);

  const [selectedTemplate, setSelectedTemplate] = useState({
    template_id: "",
    template_title: "",
    template_tag: "",
    template_url: ""
  });
  const [showEditTemplateFormModal,setShowEditTemplateFormModal] = useState(false);

  const handleCapitalizeEachFirstLetter = (text) => {
    let words = text.split(" ");
    for(let i=0; i<words.length; i++){
      words[i] = words[i].charAt(0).toUpperCase()+words[i].substring(1).toLowerCase();
    }
    text = (words.join(" "));
    return text;
  }

  const formatDate = (date) => {
    let date_object = new Date(date);
    return date_object.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
  
  const formatTime = (date) => {
    let date_object = new Date(date);
    return date_object.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  const handleDeleteTemplate = async(template_id) => {
    let ans = await showConfirm("Delete template");
    if(ans){
      try{
        const response = await fetch(`http://localhost:5000/api/template/deletetemplate`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "_id": template_id
          }
        });
        const json = await response.json();

        if(json.success){
          await fetchTemplate();
          showAlert("Success", "Your template has been deleted successfully!");
        }else{
          showAlert("Error", json.error);
        }
      }catch(err){
        showAlert("Error", "Network error. Please check your connection or try again later!");
      }
    }
  }

  return (
    <>
      {
        localStorage.getItem("adminSignedIn") && localStorage.getItem("admin_token") ?
          <div className="template-item">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p style={{fontSize: "14px"}} title={template_title}><b>Title:</b> {handleCapitalizeEachFirstLetter(template_title.length>14?template_title.slice(0,14)+"...":template_title)}</p>
                <p style={{fontSize: "14px"}} title={template_tag}><b>Tag:</b> {handleCapitalizeEachFirstLetter(template_tag.length>16?template_tag.slice(0,16)+"...":template_tag)}</p>
              </div>
              <div className="flex items-center justify-end">
                <button className="icon-btn" onClick={()=>{setSelectedTemplate({ template_id: _id, template_title: template_title, template_tag: template_tag, template_url: template_url }); setShowEditTemplateFormModal(true);}}><img src="/edit.png" alt="edit icon" style={{height: "20px", width: "20px"}}/></button>
                <button className="icon-btn" onClick={()=>{handleDeleteTemplate(_id)}}><img src="/delete.png" alt="delete icon" style={{height: "18px", width: "18px"}}/></button>
              </div>
            </div>
            <img src={template_url} style={{height: "280px", width: "100%", objectFit: "cover"}} alt="drawing"/>
            <div className="flex items-center justify-center mt-2">
              <p style={{fontSize: "12px"}}><b>{formatDate(template_updated_date)} | {formatTime(template_updated_date)}</b></p>
            </div>
          </div>
        : 
          <div className="template-item">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p style={{fontSize: "14px"}} title={template_title}><b>Title:</b> {handleCapitalizeEachFirstLetter(template_title.length>14?template_title.slice(0,14)+"...":template_title)}</p>
                <p style={{fontSize: "14px"}} title={template_tag}><b>Tag:</b> {handleCapitalizeEachFirstLetter(template_tag.length>16?template_tag.slice(0,16)+"...":template_tag)}</p>
              </div>
              <div className="flex items-center justify-end">
                <Link className="action-btn" to={`/usetemplate/${_id}`}>Use</Link>
              </div>
            </div>
            <img src={template_url} style={{height: "280px", width: "100%", objectFit: "cover"}} alt="drawing"/>
          </div>
      }

      {
        showEditTemplateFormModal
        &&
        <div className="confirm-modal-background">
          <EditTemplateForm selectedTemplate={selectedTemplate} setShowEditTemplateFormModal={setShowEditTemplateFormModal}/>
        </div>
      }
    </>
  );
}