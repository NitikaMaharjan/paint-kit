import { useContext } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function LeftNavbar(props) {

  const { setTool, tool } = useContext(DrawContext);

  const checkUserSignedIn = () => {
    if (localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")) {
      return true;
    }else{
      props.setShowUserSigninFormModal(true);
      return false;
    }
  }

  return (
    <div className="left-navbar">
      <h1 style={{marginBottom: "30px", fontSize: "14px"}}>{props.title}</h1>
      <h1 style={{textAlign: "center", fontWeight: "700", fontSize: "14px"}}>Tools</h1>
      <div className="left-tool-bar">
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className={`tool ${tool==="pen"?"selected-tool":""}`} style={{borderRight: "1px solid black"}} onClick={()=>{setTool("pen")}}>
            <img src="/pen.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className={`tool ${tool==="eraser"?"selected-tool":""}`} onClick={()=>{setTool("eraser")}}>
            <img src="/eraser.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className={`tool ${tool==="bucket"?"selected-tool":""}`} style={{borderRight: "1px solid black"}} onClick={()=>{if(checkUserSignedIn()){setTool("bucket")}}}>
            <img src="/bucket.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className={`tool ${tool==="bucketeraser"?"selected-tool":""}`} onClick={()=>{if(checkUserSignedIn()){setTool("bucketeraser")}}}>
            <img src="/eraser.png" style={{height: "18px", width: "18px"}}/>
            <img src="/bucket.png" style={{height: "18px", width: "18px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className={`tool ${tool==="text"?"selected-tool":""}`} style={{borderRight: "1px solid black"}} onClick={()=>{if(checkUserSignedIn()){setTool("text")}}}>
            <img src="/text.png" style={{height: "25px", width: "25px"}}/>
          </div>
          <div className={`tool ${tool==="line"?"selected-tool":""}`} onClick={()=>{if(checkUserSignedIn()){setTool("line")}}}>
            <img src="/line.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className={`tool ${tool==="circle"?"selected-tool":""}`} style={{borderRight: "1px solid black"}} onClick={()=>{if(checkUserSignedIn()){setTool("circle")}}}>
            <img src="/circle.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className={`tool ${tool==="square"?"selected-tool":""}`} onClick={()=>{if(checkUserSignedIn()){setTool("square")}}}>
            <img src="/square.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className={`tool ${tool==="rectangle"?"selected-tool":""}`} style={{borderRight: "1px solid black"}} onClick={()=>{if(checkUserSignedIn()){setTool("rectangle")}}}>
            <img src="/rectangle.png" style={{height: "22px", width: "22px"}}/>
          </div>
          <div className={`tool ${tool==="triangle"?"selected-tool":""}`} onClick={()=>{if(checkUserSignedIn()){setTool("triangle")}}}>
            <img src="/triangle.png" style={{height: "23px", width: "23px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className={`tool ${tool==="upparabola"?"selected-tool":""}`} style={{borderRight: "1px solid black"}} onClick={()=>{if(checkUserSignedIn()){setTool("upparabola")}}}>
            <img src="/upparabola.png" style={{height: "16px", width: "16px"}}/>
          </div>
          <div className={`tool ${tool==="downparabola"?"selected-tool":""}`} onClick={()=>{if(checkUserSignedIn()){setTool("downparabola")}}}>
            <img src="/downparabola.png" style={{height: "16px", width: "16px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className={`tool ${tool==="ellipse"?"selected-tool":""}`} style={{borderRight: "1px solid black"}} onClick={()=>{if(checkUserSignedIn()){setTool("ellipse")}}}>
            <img src="/ellipse.png" style={{height: "18px", width: "18px"}}/>
          </div>
          <div className={`tool ${tool==="parallelogram"?"selected-tool":""}`} onClick={()=>{if(checkUserSignedIn()){setTool("parallelogram")}}}>
            <img src="/parallelogram.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
        <div className="flex" style={{borderBottom: "1px solid black"}}>
          <div className={`tool ${tool==="star"?"selected-tool":""}`} style={{borderRight: "1px solid black"}} onClick={()=>{if(checkUserSignedIn()){setTool("star")}}}>
            <img src="/star.png" style={{height: "20px", width: "20px"}}/>
          </div>
          <div className={`tool ${tool==="heart"?"selected-tool":""}`} onClick={()=>{if(checkUserSignedIn()){setTool("heart")}}}>
            <img src="/heart.png" style={{height: "20px", width: "20px"}}/>
          </div>
        </div>
      </div>
    </div>
  );
}
