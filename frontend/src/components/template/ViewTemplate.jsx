import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import TemplateContext from "../../context/template/TemplateContext";
import TemplateItem from "./TemplateItem";

export default function ViewTemplate() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { fetchTemplate, fetchedTemplates } = useContext(TemplateContext);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [yScroll, setYScroll] = useState(false);

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value); 
    if(searchKeyword.trim()!==""){
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

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("adminSignedIn")){
      navigate("/usersignin");
    }else{
      if(localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")){
        showProgress();
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchTemplate();

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
      {
        localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")
        &&
        <Link className="action-btn" to="/userhome" style={{position: "fixed", top:"32px", left: "32px"}}>Back</Link>
      }

      {
        fetchedTemplates.length !==0 ?
          <div style={{marginTop: `${localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")?"24px":"0px"}`, padding: `${localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")?"32px":"0px"}`}}>
            <div className="flex justify-center mb-4">
              <form className="auth-form" style={{margin: "0px"}}>
                <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                  <img src="/search.png" alt="search button image"/>
                  <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter template title/tag" value={searchKeyword} onChange={handleSearchKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{color: "rgba(0, 0, 0, 0.8)"}}/>
                  <img src="/close.png" alt="close button image" onClick={()=>{clearInput()}} style={{opacity: `${searchKeyword===""?0:1}`}}/>
                </div>
              </form>
            </div>
            <div style={{display: "grid", gridTemplateColumns: `${localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")?"repeat(4, 1fr)":"repeat(3, 1fr)"}`, gap: "24px"}}>
              {(searchKeyword===""?fetchedTemplates:filteredTemplates).map((templateInfo, index)=>{
                return <TemplateItem key={index} templateInfo={templateInfo}/>
              }).reverse()}
            </div>
            <div className={`up-scroll-btn${yScroll?"-show":""}`} style={{bottom: "32px", right:"32px"}}>
              <a href="#top"><img src="/up-arrow.png" style={{height: "14px", width: "14px"}}/></a>
            </div>
          </div>
        :
          localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token") ?
            <div className="content">
              <p style={{fontSize: "14px"}}><b>No templates to use!</b></p>
            </div>
          :
            <div className="flex items-center justify-center" style={{height: "100%"}}>
              <p style={{fontSize: "14px"}}><b>Add templates to get started!</b></p>
            </div>
      }
    </>
  );
}