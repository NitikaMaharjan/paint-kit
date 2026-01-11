import { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import TemplateContext from "../../context/template/TemplateContext";
import ChipTag from "../ChipTag";
import TemplateItem from "./TemplateItem";

export default function ViewTemplate() {

  let navigate = useNavigate();

  const scrollContainerRef = useRef(null);
  const templateScrollRef = useRef(null);

  const { showProgress } = useContext(ProgressBarContext);
  const { fetchTemplate, fetchedTemplates } = useContext(TemplateContext);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("latest");
  const [uniqueTags, setUniqueTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [xScrollLeft, setXScrollLeft] = useState(false);
  const [xScrollRight, setXScrollRight] = useState(false);
  const [xScrollRightPrevValue, setXScrollRightPrevValue] = useState(null);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [templateYScroll, setTemplateYScroll] = useState(false);

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
    setSelectedTag("");
    if(e.target.value.trim()!==""){
      setFilteredTemplates(fetchedTemplates.filter((template)=>{return template.template_title.toLowerCase().includes(searchKeyword.toLowerCase()) || template.template_tag.toLowerCase().includes(searchKeyword.toLowerCase())}));
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
    for(let i=0; i<fetchedTemplates.length; i++){
      if(!unique_tags.includes(fetchedTemplates[i].template_tag)){
        unique_tags.push(fetchedTemplates[i].template_tag);
      }
    }
    setUniqueTags(unique_tags);
  }

  const handleSelectTag = (tag) => {
    setSearchKeyword("");
    setSelectedTag(tag);
    setFilteredTemplates(fetchedTemplates.filter((template)=>{return template.template_tag.toLowerCase().includes(tag.toLowerCase())}));
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

  const templateScrollToTop = () => {
    templateScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("adminSignedIn")){
      navigate("/");
    }else if(localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")){
      showProgress();
    }
    fetchTemplate();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(fetchedTemplates.length!== 0){
      getUniqueTags();
      if(scrollContainerRef.current && scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth){
        setXScrollRight(true);
      }else{
        setXScrollRight(false);
      }
    }
  }, [fetchedTemplates]);
  
  return (
    <>
      {
        localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")
        &&
        <Link className="action-button" to="/userhome" style={{position: "fixed", top:"32px", left: "32px"}}>Back</Link>
      }

      {
        fetchedTemplates.length !==0 ?
          <div style={{marginTop: `${localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")?"32px":"0px"}`}}>
            
            <div className="flex justify-center mb-2">
              <form className="auth-form" style={{margin: "0px"}}>
                <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                  <img src="/search.png" alt="search icon"/>
                  <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter template title/tag" value={searchKeyword} onChange={handleSearchKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{color: "rgba(0, 0, 0, 0.8)"}}/>
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

            {
              localStorage.getItem("adminSignedIn") && localStorage.getItem("admin_token") ?
                <div ref={templateScrollRef} style={{height: "430px", overflowY: "auto", scrollbarGutter: "stable", paddingRight: "10px"}} onScroll={() => setTemplateYScroll(templateScrollRef.current.scrollTop > 0)}>
                  <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px"}}>
                    {   
                      selectedTag !=="" ?
                        selectedOrder ==="latest" ?
                          (filteredTemplates).map((templateInfo, index)=>{
                            return <TemplateItem key={index} templateInfo={templateInfo}/>
                          }).reverse()
                        :
                          (filteredTemplates).map((templateInfo, index)=>{
                            return <TemplateItem key={index} templateInfo={templateInfo}/>
                          })                                      
                      : 
                        selectedOrder ==="latest" ?
                          (searchKeyword===""?fetchedTemplates:filteredTemplates).map((templateInfo, index)=>{
                            return <TemplateItem key={index} templateInfo={templateInfo}/>
                          }).reverse()
                        :
                          (searchKeyword===""?fetchedTemplates:filteredTemplates).map((templateInfo, index)=>{
                            return <TemplateItem key={index} templateInfo={templateInfo}/>
                          })
                    }
                  </div>
                  <button className={`up-scroll-button${templateYScroll?"-show":""}`} onClick={templateScrollToTop} style={{bottom: "80px", right: "80px"}}><img src="/up-arrow.png" alt="up arrow icon" style={{height: "14px", width: "14px"}}/></button>
                </div>
              : 
                <div ref={templateScrollRef} style={{height: "530px", overflowY: "auto", scrollbarGutter: "stable", padding: "0px 24px"}} onScroll={() => setTemplateYScroll(templateScrollRef.current.scrollTop > 0)}>                
                  <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px"}}>
                    {
                      selectedTag !=="" ?
                        selectedOrder ==="latest" ?
                          (filteredTemplates).map((templateInfo, index)=>{
                            return <TemplateItem key={index} templateInfo={templateInfo}/>
                          }).reverse()
                        :
                          (filteredTemplates).map((templateInfo, index)=>{
                            return <TemplateItem key={index} templateInfo={templateInfo}/>
                          })                                      
                      : 
                        selectedOrder ==="latest" ?
                          (searchKeyword===""?fetchedTemplates:filteredTemplates).map((templateInfo, index)=>{
                            return <TemplateItem key={index} templateInfo={templateInfo}/>
                          }).reverse()
                        :
                          (searchKeyword===""?fetchedTemplates:filteredTemplates).map((templateInfo, index)=>{
                            return <TemplateItem key={index} templateInfo={templateInfo}/>
                          })
                    }
                  </div>
                  <button className={`up-scroll-button${templateYScroll?"-show":""}`} onClick={templateScrollToTop} style={{bottom: "40px", right: "50px"}}><img src="/up-arrow.png" alt="up arrow icon" style={{height: "14px", width: "14px"}}/></button>
                </div>
            }
          </div>
        :
          localStorage.getItem("adminSignedIn") && localStorage.getItem("admin_token") ?
            <div className="flex justify-center items-center" style={{height: "508px"}}>
              <p style={{fontSize: "14px"}}><b>Add templates to get started!</b></p>
            </div>
          :
            <div className="content">
              <p style={{fontSize: "14px"}}><b>No templates to use!</b></p>
            </div>
      }
    </>
  );
}