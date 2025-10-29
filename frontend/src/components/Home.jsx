import { useContext, useEffect } from "react";
import ProgressBarContext from "../context/progressbar/ProgressBarContext";
import GenerateColorPalette from "./GenerateColorPalette";

export default function Home() {

  const { showProgress } = useContext(ProgressBarContext);

  useEffect(() => {
    showProgress();
    // eslint-disable-next-line
  }, []);
  
  return (
    <div className="content">
      <GenerateColorPalette/>
    </div>
  )
}
