import { useContext } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function LeftNavbar(props) {

  const { setTool } = useContext(DrawContext);

  return (
    <div className="left-navbar">
      <div className="flex">
        <h1>{props.title}</h1>
        <p>{props.tag}</p>
      </div>
      <div className="left-tool-bar">
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("pen")}}>
            <img src="/pen.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("eraser")}}>
            <img src="/eraser.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("bucket fill")}}>
            <img src="/bucket.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("bucket eraser")}}>
            <img src="/bucket.png" style={{height: "18px", width: "18px"}}/>
            <img src="/eraser.png" style={{height: "18px", width: "18px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("text")}}>
            <img src="/text.png" style={{height: "25px", width: "25px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("line")}}>
            <img src="/line.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("circle")}}>
            <img src="/circle.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("square")}}>
            <img src="/square.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("rectangle")}}>
            <img src="/rectangle.png" style={{height: "22px", width: "22px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("triangle")}}>
            <img src="/triangle.png" style={{height: "23px", width: "23px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("up parabola")}}>
            <img src="/upparabola.png" style={{height: "16px", width: "16px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("down parabola")}}>
            <img src="/downparabola.png" style={{height: "16px", width: "16px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("ellipse")}}>
            <img src="/ellipse.png" style={{height: "18px", width: "18px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("parallelogram")}}>
            <img src="/parallelogram.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className="tool" style={{borderRight: "1px solid black"}} onClick={()=>{setTool("star")}}>
            <img src="/star.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className="tool" onClick={()=>{setTool("heart")}}>
            <img src="/heart.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
      </div>
    </div>
  )
}
