import { useContext } from "react";
import { Link } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import ConfirmContext from "../../context/confirm/ConfirmContext";
import DrawContext from "../../context/draw/DrawContext";

export default function DrawingItem(props) {

  const { _id, drawing_title, drawing_tag, drawing_url, date } = props.drawingInfo;

  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);
  const { fetchDrawing } = useContext(DrawContext);

  const handleDeleteDrawing = async(id) => {
    let ans = await showConfirm("Delete drawing");
    if(ans){
      try{
        const response = await fetch(`http://localhost:5000/api/drawing/deletedrawing`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "_id": id
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
    <div>      
      <Link className="confirm-btn" to={`/editdrawing/${_id}`}>Edit</Link>
      <button className="confirm-btn" onClick={()=>{handleDeleteDrawing(`${_id}`)}}>Delete</button>
      <h1>{drawing_title}</h1>
      <p>{drawing_tag}</p>
      <p>{date}</p>
      <img src={drawing_url} style={{height: "120px", width: "200px"}}/>
    </div>
  );
}
