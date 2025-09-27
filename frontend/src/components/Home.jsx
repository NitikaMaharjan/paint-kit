import { useContext, useEffect } from "react";
import ProgressBarContext from "../context/progressbar/ProgressBarContext";

export default function Home() {

  const { showProgress } = useContext(ProgressBarContext);

  useEffect(() => {
    showProgress();
    // eslint-disable-next-line
  }, []);
  
  return (
    <h1>Hello World!</h1>
  )
}
