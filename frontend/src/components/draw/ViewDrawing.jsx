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
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchDrawing();
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      {
        fetchedDrawings.length !==0 ?
          <div>
            {fetchedDrawings.map((drawingInfo, index)=>{
              return <DrawingItem key={index} drawingInfo={drawingInfo}/>
            }).reverse()}
          </div>
        :
          <div>
            no drawings
          </div>
      }
    </>
  );
}
