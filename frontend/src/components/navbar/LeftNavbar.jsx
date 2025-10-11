import { useContext } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function LeftNavbar() {

  const { setTool } = useContext(DrawContext);

  return (
    <div className="left-navbar">
      <div className="flex">
        <h1>Untitled</h1>
        <p>General</p>
      </div>
      <div className="left-tool-bar">
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("pen")}}>
            <img src="pen.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("eraser")}}>
            <img src="eraser.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("bucket fill")}}>
            <img src="bucket.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("bucket eraser")}}>
            <img src="bucket.png" style={{height: "18px", width: "18px"}}/>
            <img src="eraser.png" style={{height: "18px", width: "18px"}}/>
          </div>
        </div>
      </div>
    </div>
  )
}
