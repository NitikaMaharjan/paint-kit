import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import TemplateContext from "../../context/template/TemplateContext";
import EditTemplate from "../template/EditTemplate";

export default function DrawingItem(props) {

  const { _id, template_title, template_tag, image_url, date } = props.templateInfo;

  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);
  const { fetchTemplate } = useContext(TemplateContext);

  const [showEditTemplateModal,setShowEditTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({
    template_id: "",
    template_title: "",
    template_tag: "",
    image_url: ""
  });

  const handleTemplateDelete = async(id)=> {
    let ans = await showConfirm("Delete template");
    if (ans){
      try{
        const response = await fetch(`http://localhost:5000/api/template/template/deletetemplate`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "_id": id
          }
        });
        const json = await response.json();

        if(json.success){
          showAlert("Success", "Your template has been deleted successfully!");
          fetchTemplate();
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
      {localStorage.getItem("adminSignedIn") && localStorage.getItem("admin_token")?
        <div>
          <button className="confirm-btn" onClick={()=>{setSelectedTemplate({template_id: _id, template_title: template_title, template_tag: template_tag, image_url: image_url}); setShowEditTemplateModal(true);}}>Edit</button>
          <button className="confirm-btn" onClick={()=>{handleTemplateDelete(_id)}}>Delete</button>
          <h1>{template_title}</h1>
          <p>{template_tag}</p>
          <p>{date}</p>
          <img src={image_url} style={{height: "120px", width: "200px"}}/>
        </div>
      :
        <div>
          <Link className="confirm-btn" to={`/usetemplate/${_id}`}>Use</Link>
          <h1>{template_title}</h1>
          <p>{template_tag}</p>
          <img src={image_url} style={{height: "120px", width: "200px"}}/>
        </div>
      }
      {
        showEditTemplateModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowEditTemplateModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <EditTemplate selectedTemplate={selectedTemplate} setShowEditTemplateModal={setShowEditTemplateModal}/>
            </div>
        </div>
      }
    </>
  )
}
