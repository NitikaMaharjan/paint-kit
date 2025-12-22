import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../context/progressbar/ProgressBarContext";
import Canvas from "./draw/Canvas";
import BottomNavbar from "./navbar/BottomNavbar";
import LeftNavbar from "./navbar/LeftNavbar";
import UserTopNavbar from "./navbar/UserTopNavbar";
import RightNavbar from "./navbar/RightNavbar";
import UserSignin from "./user/UserSignin";

export default function Home() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);

  const [showUserSigninFormModal, setShowUserSigninFormModal] = useState(false);

  const checkUserSignedIn = () => {
    setShowUserSigninFormModal(true);
    return false;
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
      <Canvas url=""/>
      <BottomNavbar checkUserSignedIn={checkUserSignedIn}/>
      <LeftNavbar checkUserSignedIn={checkUserSignedIn}/>
      <UserTopNavbar title="Untitled" tag="General" edit={false} drawingid="" checkUserSignedIn={checkUserSignedIn}/>
      <RightNavbar checkUserSignedIn={checkUserSignedIn} fromHome={true}/>

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