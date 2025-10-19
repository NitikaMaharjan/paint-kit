import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AlertContext from "../../context/alert/AlertContext";
import LeftNavbar from "../navbar/LeftNavbar";
import RightNavbar from "../navbar/RightNavbar";
import BottomNavbar from "../navbar/BottomNavbar";
import Canvas from "./Canvas";

export default function UserEditDrawing() {

    let navigate = useNavigate();

    const { drawingid } = useParams();

    const { showAlert } = useContext(AlertContext);

    const [drawingInfo, setDrawingInfo] = useState([]);

    const fetchUserEditDrawing = async()=> {
        try{
            const response = await fetch(`http://localhost:5000/api/drawing/drawing/fetchusereditdrawing`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "_id": drawingid
                }
            });
            const json = await response.json();

            if(json.success){
                setDrawingInfo(json.fetchedUserEditDrawing);
            }else{
                navigate("/userhome");
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!");
        }
    }

    useEffect(() => {
        fetchUserEditDrawing();
        // eslint-disable-next-line
    }, []);

    return (
        <>  
            {
                drawingInfo.length!==0?
                    <>
                        <BottomNavbar/>
                        <LeftNavbar title={drawingInfo.drawing_title} tag={drawingInfo.drawing_tag}/>
                        <RightNavbar title={drawingInfo.drawing_title} tag={drawingInfo.drawing_tag} edit={true} drawingid={drawingid}/>
                        <Canvas url={drawingInfo.drawing_url}/>
                    </>
                :
                    <></>
            }
        </>
    )
}
