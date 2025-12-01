import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      {
        fetchedDrawings.length !==0 ?
          <div style={{padding: "32px"}}>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px"}}>
              {fetchedDrawings.map((drawingInfo, index)=>{
                return <DrawingItem key={index} drawingInfo={drawingInfo}/>
              }).reverse()}
            </div>
          </div>
        :
          <div className="flex items-center justify-center" style={{height: "100%"}}>
            <p style={{fontSize: "14px"}}><b>Start creating to get started!</b></p>
          </div>
      }
    </>
  );
}
