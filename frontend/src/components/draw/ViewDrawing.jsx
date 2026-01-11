import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import DrawContext from "../../context/draw/DrawContext";
import CursorContext from "../../context/cursor/CursorContext";
import ChipTag from "../ChipTag";
import DrawingItem from "./DrawingItem";

export default function ViewDrawing() {

  let navigate = useNavigate();
  
  const scrollContainerRef = useRef(null);
  const drawingScrollRef = useRef(null);

  const { showProgress } = useContext(ProgressBarContext);
  const { fetchDrawing, fetchedDrawings } = useContext(DrawContext);
  const { setCursorImg } = useContext(CursorContext);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("latest");
  const [uniqueTags, setUniqueTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [xScrollLeft, setXScrollLeft] = useState(false);
  const [xScrollRight, setXScrollRight] = useState(false);
  const [xScrollRightPrevValue, setXScrollRightPrevValue] = useState(null);
  const [filteredDrawings, setFilteredDrawings] = useState([]);
  const [drawingYScroll, setDrawingYScroll] = useState(false);

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
    setSelectedTag("");
    if(e.target.value.trim()!==""){
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

  const getUniqueTags = () => {
    let unique_tags = [];
    for(let i=0; i<fetchedDrawings.length; i++){
      if(!unique_tags.includes(fetchedDrawings[i].drawing_tag)){
        unique_tags.push(fetchedDrawings[i].drawing_tag);
      }
    }
    setUniqueTags(unique_tags);
  }

  const handleSelectTag = (tag) => {
    setSearchKeyword("");
    setSelectedTag(tag);
    setFilteredDrawings(fetchedDrawings.filter((drawing)=>{return drawing.drawing_tag.toLowerCase().includes(tag.toLowerCase())}));
  }

  const handleScroll = (scrollOffset) => {
    if(scrollContainerRef.current){
      setXScrollRightPrevValue(scrollContainerRef.current.scrollLeft);
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }

    if(scrollContainerRef.current.scrollLeft!==0){
      setXScrollLeft(true);
    }else{
      setXScrollLeft(false);
    }

    if(xScrollRightPrevValue===scrollContainerRef.current.scrollLeft){
      setXScrollRight(false);
    }else{
      setXScrollRight(true);
    }
  }

  const drawingScrollToTop = () => {
    drawingScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }
  
  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
      navigate("/");
    }else{
      setCursorImg(false);
      showProgress();
      fetchDrawing();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(fetchedDrawings.length!== 0){
      getUniqueTags();
      if(scrollContainerRef.current && scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth){
        setXScrollRight(true);
      }else{
        setXScrollRight(false);
      }
    }
  }, [fetchedDrawings]); 
  
  return (
    <>
      <Link className="action-btn" to="/userhome" style={{position: "fixed", top:"32px", left: "32px"}}>Back</Link>
      {
        fetchedDrawings.length !==0 ?
          <div style={{marginTop: "32px"}}>

            <div className="flex justify-center mb-2">
              <form className="auth-form" style={{margin: "0px"}}>
                <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                  <img src="/search.png" alt="search icon"/>
                  <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter drawing title/tag" value={searchKeyword} onChange={handleSearchKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{color: "rgba(0, 0, 0, 0.8)"}}/>
                  <img src="/close.png" alt="close icon" onClick={()=>{clearInput()}} style={{opacity: `${searchKeyword===""?"0":"1"}`}}/>
                </div>
              </form>
            </div>

            <div className="flex justify-center mb-4">
              <button className={`chip left-scroll-arrow${xScrollLeft?"-show":""}`} style={{marginRight: "6px"}} onClick={() => handleScroll(-100)}>
                <img src="/left-arrow.png" alt="left arrow icon" height="14px" width="14px"/>
              </button>
              <div className="flex justify-center" style={{width: "500px"}}>
                <div ref={scrollContainerRef} className="scroll-menu">
                  <div className="flex" style={{gap: "6px"}}>
                    <button className={`chip ${(selectedOrder==="latest" || selectedOrder==="oldest") && searchKeyword==="" && selectedTag===""?"chip-active":""}`} onClick={()=>{setSearchKeyword(""); setSelectedTag("");}}>All</button>
                    <button className={`chip ${selectedOrder==="latest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("latest")}}>Latest</button>
                    <button className={`chip ${selectedOrder==="oldest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("oldest")}}>Oldest</button>
                    {   
                      uniqueTags.length !== 0 ?
                        uniqueTags.map((tag, index) => {
                          return <ChipTag key={index} tag={tag} selectedTag={selectedTag} handleSelectTag={handleSelectTag}/>
                        })
                      :
                        <></>
                    }
                  </div>
                </div>
              </div>
              <button className={`chip right-scroll-arrow${xScrollRight?"-show":""}`} style={{marginLeft: "6px"}} onClick={() => handleScroll(100)}>
                <img src="/right-arrow.png" alt="right arrow icon" height="14px" width="14px"/>
              </button>
            </div>
            
            <div ref={drawingScrollRef} style={{height: "530px", overflowY: "auto", scrollbarGutter: "stable", padding: "0px 24px"}} onScroll={() => setDrawingYScroll(drawingScrollRef.current.scrollTop > 0)}>          
              <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px"}}>
                {   
                  selectedTag !=="" ?
                    selectedOrder ==="latest" ?
                      (filteredDrawings).map((drawingInfo, index)=>{
                        return <DrawingItem key={index} drawingInfo={drawingInfo}/>
                      }).reverse()
                    :
                      (filteredDrawings).map((drawingInfo, index)=>{
                        return <DrawingItem key={index} drawingInfo={drawingInfo}/>
                      })                                      
                  : 
                    selectedOrder ==="latest" ?
                      (searchKeyword===""?fetchedDrawings:filteredDrawings).map((drawingInfo, index)=>{
                        return <DrawingItem key={index} drawingInfo={drawingInfo}/>
                      }).reverse()
                    :
                      (searchKeyword===""?fetchedDrawings:filteredDrawings).map((drawingInfo, index)=>{
                        return <DrawingItem key={index} drawingInfo={drawingInfo}/>
                      })                                      
                }
              </div>
              <button className={`up-scroll-btn${drawingYScroll?"-show":""}`} onClick={drawingScrollToTop} style={{bottom: "40px", right: "50px"}}><img src="/up-arrow.png" alt="up arrow icon" style={{height: "14px", width: "14px"}}/></button>
            </div>
          </div>
        :
          <div className="content">
            <p style={{fontSize: "14px"}}><b>Draw something and save it to see your drawings here!</b></p>
          </div>
      }
    </>
  );
}