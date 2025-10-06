import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import RightNavbar from '../navbar/RightNavbar';

export default function UserHome() {

  let navigate = useNavigate();

  const { showProgress } = useContext(ProgressBarContext);

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
      navigate("/usersignin");
    }else{
      showProgress();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <RightNavbar/>
  )
}