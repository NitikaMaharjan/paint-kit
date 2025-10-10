import { useContext, useEffect } from "react";
import DrawContext from "../../context/draw/DrawContext";
import DrawingItem from "./DrawingItem";

export default function ViewUserDrawing() {

  const { fetchUserDrawing, fetchedDrawings } = useContext(DrawContext);

  useEffect(() => {
    fetchUserDrawing();
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      {
        fetchedDrawings.length!==0?
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
  )
}
