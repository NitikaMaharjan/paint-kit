import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import TemplateContext from "../../context/template/TemplateContext";
import EditTemplateForm from "../template/EditTemplateForm";

export default function DrawingItem(props) {

  const { _id, template_title, template_tag, image_url, date } = props.templateInfo;

  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);
  const { fetchTemplate } = useContext(TemplateContext);

  const [showEditTemplateFormModal,setShowEditTemplateFormModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({
    template_id: "",
    template_title: "",
    template_tag: "",
    image_url: ""
  });

  const handleDeleteTemplate = async(id) => {
    let ans = await showConfirm("Delete template");
    if(ans){
      try{
        const response = await fetch(`http://localhost:5000/api/template/deletetemplate`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "_id": id
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
                <h1 style={{fontSize: "14px"}}><b>Title:</b> {template_title}</h1>
                <p style={{fontSize: "13px"}}><b>Tag:</b> {template_tag}</p>
              </div>
              <div className="flex items-center justify-end">
                <button className="icon-btn" onClick={()=>{setSelectedTemplate({ template_id: _id, template_title: template_title, template_tag: template_tag, image_url: image_url }); setShowEditTemplateFormModal(true);}}><img src="/edit.png" style={{height: "20px", width: "20px"}}/></button>
                <button className="icon-btn" onClick={()=>{handleDeleteTemplate(_id)}}><img src="/delete.png" style={{height: "18px", width: "18px"}}/></button>
              </div>
            </div>
            <img src={image_url} style={{height: "280px", width: "100%", objectFit: "cover"}}/>
          </div>
        : 
          <div className="template-item">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 style={{fontSize: "14px"}}><b>Title:</b> {template_title}</h1>
                <p style={{fontSize: "13px"}}><b>Tag:</b> {template_tag}</p>
              </div>
              <div className="flex items-center justify-end">
                <Link className="action-btn" to={`/usetemplate/${_id}`}>Use</Link>
              </div>
            </div>
            <img src={image_url} style={{height: "280px", width: "100%", objectFit: "cover"}}/>
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
