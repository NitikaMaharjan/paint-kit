import { useContext, useEffect } from "react";
import ProgressBarContext from "../context/progressbar/ProgressBarContext";
import LeftNavbar from "./navbar/LeftNavbar";
import BottomNavbar from "./navbar/BottomNavbar";
import RightNavbar from "./navbar/RightNavbar";
import Canvas from "./draw/Canvas";

export default function Home() {

  const { showProgress } = useContext(ProgressBarContext);

  useEffect(() => {
    showProgress();
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      <BottomNavbar/>
      <LeftNavbar title="Untitled" tag="General"/>
      <RightNavbar title="Untitled" tag="General" edit={false} drawingid=""/>
      <Canvas url=""/>
    </>
  );
}