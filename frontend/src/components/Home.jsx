import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../context/progressbar/ProgressBarContext";
import LeftNavbar from "./navbar/LeftNavbar";
import BottomNavbar from "./navbar/BottomNavbar";
import RightNavbar from "./navbar/RightNavbar";
import Canvas from "./draw/Canvas";
import UserSignin from "./user/UserSignin";

export default function Home() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);

  const [showUserSigninFormModal, setShowUserSigninFormModal] = useState(false);

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
      showProgress();
    }else{
      navigate("/userhome");
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      <BottomNavbar/>
      <LeftNavbar title="Untitled" tag="General" setShowUserSigninFormModal={setShowUserSigninFormModal}/>
      <RightNavbar title="Untitled" tag="General" edit={false} drawingid=""/>
      <Canvas url=""/>
      {
        showUserSigninFormModal
        &&
        <div className="confirm-modal-background">
          <UserSignin popup={true} setShowUserSigninFormModal={setShowUserSigninFormModal}/>
        </div>
      }
    </>
  );
}