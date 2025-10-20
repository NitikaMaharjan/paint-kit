import { useContext } from "react";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import TemplateContext from "../../context/template/TemplateContext";

export default function DrawingItem(props) {

  const { _id, template_title, template_tag, image_url, date } = props.templateInfo;

  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);
  const { fetchTemplate } = useContext(TemplateContext);

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
    <div>
      <button className="confirm-btn" onClick={()=>{handleTemplateDelete(_id)}}>Delete</button>
      <h1>{template_title}</h1>
      <p>{template_tag}</p>
      <p>{date}</p>
      <img src={image_url} style={{height: "120px", width: "200px"}}/>
    </div>
  )
}
