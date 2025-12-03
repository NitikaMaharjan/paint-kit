import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import TemplateContext from "../../context/template/TemplateContext";
import TemplateItem from "./TemplateItem";

export default function ViewTemplate() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);
  const { fetchTemplate, fetchedTemplates } = useContext(TemplateContext);

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
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      {
        fetchedTemplates.length !==0 ?
          <div style={{padding: `${localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")?"32px":""}`}}>
            <div style={{display: "grid", gridTemplateColumns: `${localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")?"repeat(4, 1fr)":"repeat(3, 1fr)"}`, gap: "24px"}}>
              {fetchedTemplates.map((templateInfo, index)=>{
                return <TemplateItem key={index} templateInfo={templateInfo}/>
              }).reverse()}
            </div>
          </div>
        :
          <div className="flex items-center justify-center" style={{height: "100%"}}>
            <p style={{fontSize: "14px"}}><b>Add templates to get started!</b></p>
          </div>
      }
    </>
  );
}