import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import LeftNavbar from "../navbar/LeftNavbar";
import RightNavbar from "../navbar/RightNavbar";
import BottomNavbar from "../navbar/BottomNavbar";
import Canvas from "./Canvas";
import UserTopNavbar from "../navbar/UserTopNavbar";

export default function UseTemplate() {

    let navigate = useNavigate();

    const { templateid } = useParams();

    const { showProgress } = useContext(ProgressBarContext);
    const { showAlert } = useContext(AlertContext);

    const [templateInfo, setTemplateInfo] = useState([]);

    const fetchTemplateInfo = async() => {
        try{
            const response = await fetch(`http://localhost:5000/api/template/fetchtemplatetouse`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "_id": templateid
                }
            });
            const json = await response.json();

            if(json.success){
                setTemplateInfo(json.fetchedTemplateInfo);
            }else{
                navigate("/userhome");
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!");
        }
    }

    const checkUserSignedIn = () => {
        if(localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")){
            return true;
        }
    }

    useEffect(() => {
        if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
            navigate("/usersignin");
        }else{
            showProgress();
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchTemplateInfo();
        // eslint-disable-next-line
    }, []);

    return (
        <>  
            {
                templateInfo.length !==0 ?
                    <>
                        <UserTopNavbar title={templateInfo.template_title} tag={templateInfo.template_tag} edit={false} drawingid="" checkUserSignedIn={checkUserSignedIn}/>
                        <BottomNavbar checkUserSignedIn={checkUserSignedIn}/>
                        <LeftNavbar checkUserSignedIn={checkUserSignedIn}/>
                        <RightNavbar checkUserSignedIn={checkUserSignedIn} fromHome={false}/>
                        <Canvas url={templateInfo.template_url}/>
                    </>
                :
                    <>
                        template not found
                    </>
            }
        </>
    );
}