import { useContext, useEffect } from "react";
import ProgressBarContext from "../context/progressbar/ProgressBarContext";
import CreateColorPalette from "./CreateColorPalette";

export default function Home() {

  const { showProgress } = useContext(ProgressBarContext);

  useEffect(() => {
    showProgress();
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      <CreateColorPalette/>
    </>
  )
}
