import { useState } from "react";
import TemplateContext from "./TemplateContext";

export default function TemplateState(props) {

    const [fetchedTemplates, setFetchedTemplates] = useState([]);

    const fetchTemplate = async() => {
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/template/fetchtemplate`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();

            if(json.success){
                setFetchedTemplates(json.fetchedTemplates);
            }else{
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!");
        }
    }

    return (
        <TemplateContext.Provider value={{ fetchTemplate, fetchedTemplates }}>
            {props.children}
        </TemplateContext.Provider>
    );
}