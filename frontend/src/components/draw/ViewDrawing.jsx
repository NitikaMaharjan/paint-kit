import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import DrawContext from "../../context/draw/DrawContext";
import DrawingItem from "./DrawingItem";

export default function ViewDrawing() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { fetchDrawing, fetchedDrawings } = useContext(DrawContext);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredDrawings, setFilteredDrawings] = useState([]);
  const [yScroll, setYScroll] = useState(false);

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value); 
    if(searchKeyword.trim()!==""){
      setFilteredDrawings(fetchedDrawings.filter((drawing)=>{return drawing.drawing_title.toLowerCase().includes(searchKeyword.toLowerCase()) || drawing.drawing_tag.toLowerCase().includes(searchKeyword.toLowerCase())}));
    }
  }

  const clearInput = () => {
    setSearchKeyword("");
  }

  const addBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
      navigate("/usersignin");
    }else{
      showProgress();
      fetchDrawing();
    }

    window.addEventListener("scroll", () => {
      if(window.scrollY){
        setYScroll(true);
      }else{
        setYScroll(false);
      }
    });
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      <Link className="action-btn" to="/userhome" style={{position: "fixed", top:"32px", left: "32px"}}>Back</Link>
      {
        fetchedDrawings.length !==0 ?
          <div style={{marginTop: "24px", padding: "32px"}}>
            <div className="flex justify-center mb-4">
              <form className="auth-form" style={{margin: "0px"}}>
                <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                  <img src="/search.png" alt="search button image"/>
                  <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter drawing title/tag" value={searchKeyword} onChange={handleSearchKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{color: "rgba(0, 0, 0, 0.8)"}}/>
                  <img src="/close.png" alt="close button image" onClick={()=>{clearInput()}} style={{opacity: `${searchKeyword===""?0:1}`}}/>
                </div>
              </form>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px"}}>
              {(searchKeyword===""?fetchedDrawings:filteredDrawings).map((drawingInfo, index)=>{
                return <DrawingItem key={index} drawingInfo={drawingInfo}/>
              }).reverse()}
            </div>
            <div className={`up-scroll-btn${yScroll?"-show":""}`} style={{bottom: "32px", right:"32px"}}>
              <a href="#top"><img src="/up-arrow.png" style={{height: "14px", width: "14px"}}/></a>
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