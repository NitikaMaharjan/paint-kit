import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import DrawContext from "../../context/draw/DrawContext";
import DrawingItem from "./DrawingItem";

export default function ViewDrawing() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { fetchDrawing, fetchedDrawings } = useContext(DrawContext);

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
      navigate("/usersignin");
    }else{
      showProgress();
      fetchDrawing();
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      <Link className="action-btn" to="/userhome" style={{position: "fixed", top:"32px", left: "32px"}}>Back</Link>
      {
        fetchedDrawings.length !==0 ?
          <div style={{marginTop: "48px", padding: "32px"}}>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px"}}>
              {fetchedDrawings.map((drawingInfo, index)=>{
                return <DrawingItem key={index} drawingInfo={drawingInfo}/>
              }).reverse()}
            </div>
          </div>
        :
          <div className="content">
            <p style={{fontSize: "14px"}}><b>Start creating to get started!</b></p>
          </div>
      }
    </>
  );
}