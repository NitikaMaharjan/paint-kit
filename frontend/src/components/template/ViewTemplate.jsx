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
      navigate("/");
    }else{
      showProgress();
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
          <div>
            {fetchedTemplates.map((templateInfo, index)=>{
              return <TemplateItem key={index} templateInfo={templateInfo}/>
            }).reverse()}
          </div>
        :
          <div>
            no templates
          </div>
      }
    </>
  );
}
