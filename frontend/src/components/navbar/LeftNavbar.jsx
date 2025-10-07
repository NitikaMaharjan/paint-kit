import { useContext } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function LeftNavbar() {

  const { setTool } = useContext(DrawContext);

  return (
    <div className="left-navbar">
        <div className="left-tool-bar">
          <div className="flex" style={{borderBottom: "1px solid black"}}>
            <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("pen")}}>
              <img src="pen.png" style={{height: "20px", width: "20px"}}/>
            </div>
            <div className="tool" onClick={()=>{setTool("eraser")}}>
              <img src="eraser.png" style={{height: "20px", width: "20px"}}/>
            </div>
          </div>
        </div>
    </div>
  )
}
