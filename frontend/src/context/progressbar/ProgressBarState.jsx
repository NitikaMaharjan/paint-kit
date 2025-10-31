import { useState } from "react";
import ProgressBarContext from "./ProgressBarContext";
import LoadingBar from "react-top-loading-bar";

export default function ProgressState(props) {
    
    const [progress, setProgress] = useState(0);

    const wait = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 150); // 150ms is 0.15s
        });
    }
    
    const showProgress = async() => {
        setProgress(0);
        await wait();
        setProgress(10);
        await wait();
        setProgress(30);
        await wait();
        setProgress(50);
        await wait();
        setProgress(70);
        await wait();
        setProgress(90);
        await wait();
        setProgress(100);
    };

    return(
        <>
            <ProgressBarContext.Provider value={{ showProgress }}>
                {props.children}
            </ProgressBarContext.Provider>

            <LoadingBar color="#6d6d6dff" progress={progress} height={3}/>
        </>
    );
}