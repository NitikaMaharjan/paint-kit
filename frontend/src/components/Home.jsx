import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../context/progressbar/ProgressBarContext";
import LeftNavbar from "./navbar/LeftNavbar";
import BottomNavbar from "./navbar/BottomNavbar";
import RightNavbar from "./navbar/RightNavbar";
import Canvas from "./draw/Canvas";
import UserSignin from "./user/UserSignin";
import UserTopNavbar from "./navbar/UserTopNavbar";

export default function Home() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);

  const [showUserSigninFormModal, setShowUserSigninFormModal] = useState(false);

  const checkUserSignedIn = () => {
    if(localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")){
      return true;
    }else{
      setShowUserSigninFormModal(true);
      return false;
    }
  }

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
      <UserTopNavbar title="Untitled" tag="General" drawingid="" edit={false} checkUserSignedIn={checkUserSignedIn}/>
      <BottomNavbar checkUserSignedIn={checkUserSignedIn}/>
      <LeftNavbar checkUserSignedIn={checkUserSignedIn}/>
      <RightNavbar checkUserSignedIn={checkUserSignedIn} fromHome={true}/>
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