import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import Canvas from "../draw/Canvas";
import BottomNavbar from "../navbar/BottomNavbar";
import LeftNavbar from "../navbar/LeftNavbar";
import UserTopNavbar from "../navbar/UserTopNavbar";
import RightNavbar from "../navbar/RightNavbar";

export default function UserHome() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);

  const checkUserSignedIn = () => {
    return true;
  }

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
      navigate("/");
    }else{
      showProgress();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Canvas url=""/>
      <BottomNavbar checkUserSignedIn={checkUserSignedIn}/>
      <LeftNavbar checkUserSignedIn={checkUserSignedIn}/>
      <UserTopNavbar title="Untitled" tag="General" edit={false} drawingid="" checkUserSignedIn={checkUserSignedIn}/>
      <RightNavbar checkUserSignedIn={checkUserSignedIn} fromHome={false}/>
    </>
  );
}