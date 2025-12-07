import { useContext } from "react";
import { Link } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import DrawContext from "../../context/draw/DrawContext";

export default function DrawingItem(props) {

  const { _id, drawing_title, drawing_tag, drawing_url, drawing_updated_date } = props.drawingInfo;

  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);
  const { fetchDrawing } = useContext(DrawContext);

  const handleDeleteDrawing = async(drawing_id) => {
    let ans = await showConfirm("Delete drawing");
    if(ans){
      try{
        const response = await fetch(`http://localhost:5000/api/drawing/deletedrawing`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "_id": drawing_id
          }
        });
        const json = await response.json();

        if(json.success){
          showAlert("Success", "Your drawing has been deleted successfully!");
          await fetchDrawing();
        }else{
          showAlert("Error", json.error);
        }
      }catch(err){
        showAlert("Error", "Network error. Please check your connection or try again later!");
      }
    }
  }

  return (
    <div className="template-item">
      <div className="flex items-center justify-between mb-2"> 
        <div>
          <h1 style={{fontSize: "14px"}}><b>Title:</b> {drawing_title.length>14?drawing_title.slice(0,14)+"...":drawing_title}</h1>
          <p style={{fontSize: "13px"}}><b>Tag:</b> {drawing_tag}</p>
        </div>  
        <div className="flex items-center justify-end">
          <Link className="icon-btn" to={`/editdrawing/${_id}`}><img src="/edit.png" alt="edit icon" style={{height: "20px", width: "20px"}}/></Link>
          <button className="icon-btn" onClick={()=>{handleDeleteDrawing(`${_id}`)}}><img src="/delete.png" alt="delete icon" style={{height: "18px", width: "18px"}}/></button>
        </div>
      </div> 
      <img src={drawing_url} style={{height: "280px", width: "100%", objectFit: "cover"}} alt="drawing"/>
    </div>
  );
}