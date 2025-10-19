import { useContext, useEffect } from "react";
import TemplateContext from "../../context/template/TemplateContext";
import TemplateItem from "./TemplateItem";

export default function ViewTemplate() {

  const { fetchTemplate, fetchedTemplates } = useContext(TemplateContext);

  useEffect(() => {
    fetchTemplate();
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      {
        fetchedTemplates.length!==0?
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
  )
}
