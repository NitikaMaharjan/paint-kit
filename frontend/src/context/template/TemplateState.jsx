import { useState } from "react";
import TemplateContext from "./TemplateContext";

export default function TemplateState(props) {

    const [fetchedTemplates, setFetchedTemplates] = useState([]);

    const fetchTemplate = async() => {
        try{
            const response = await fetch(`http://localhost:5000/api/template/fetchtemplate`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();

            if(json.success){
                setFetchedTemplates(json.templates);
            }else{
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!");
        }
    }

    return(
        <TemplateContext.Provider value={{ fetchTemplate, fetchedTemplates }}>
            {props.children}
        </TemplateContext.Provider>
    );
}