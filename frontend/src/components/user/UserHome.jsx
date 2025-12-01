import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import LeftNavbar from "../navbar/LeftNavbar";
import RightNavbar from "../navbar/RightNavbar";
import BottomNavbar from "../navbar/BottomNavbar";
import Canvas from "../draw/Canvas";

export default function UserHome() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);

  const checkUserSignedIn = () => {
    if (localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")) {
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

  return (
    <>
      <BottomNavbar checkUserSignedIn={checkUserSignedIn}/>
      <LeftNavbar title="Untitled" tag="General" checkUserSignedIn={checkUserSignedIn}/>
      <RightNavbar title="Untitled" tag="General" edit={false} drawingid=""/>
      <Canvas url=""/>
    </>
  );
}