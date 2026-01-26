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

  const handleDeleteDrawing = async(drawing_id) => {
    let ans = await showConfirm("Delete drawing");
    if(ans){
      try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/drawing/deletedrawing`, {
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
          <p style={{fontSize: "14px"}} title={drawing_title}><b>Title:</b> {handleCapitalizeEachFirstLetter(drawing_title.length>14?drawing_title.slice(0,14)+"...":drawing_title)}</p>
          <p style={{fontSize: "14px"}} title={drawing_tag}><b>Tag:</b> {handleCapitalizeEachFirstLetter(drawing_tag.length>16?drawing_tag.slice(0,16)+"...":drawing_tag)}</p>
        </div>
        <div className="flex items-center justify-end">
          <Link className="edit-delete-button" to={`/editdrawing/${_id}`}><img src="/edit.png" alt="edit icon" style={{height: "20px", width: "20px"}}/></Link>
          <button className="edit-delete-button" onClick={()=>{handleDeleteDrawing(`${_id}`)}}><img src="/delete.png" alt="delete icon" style={{height: "18px", width: "18px"}}/></button>
        </div>
      </div> 
      <img src={drawing_url} style={{height: "160px", width: "100%", objectFit: "contain"}} alt="drawing"/>
      <div className="flex items-center justify-center mt-2">
        <p style={{fontSize: "12px"}}><b>{formatDate(drawing_updated_date)} | {formatTime(drawing_updated_date)}</b></p>
      </div>
    </div>
  );
}