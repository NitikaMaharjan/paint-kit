import { useEffect, useState } from "react";

export default function ScreenSizeDetector() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const isDesktopEnvironment = window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches;
        setIsMobile(!isDesktopEnvironment);
    }, []);

    return (
        <>
            {
                isMobile
                &&
                <div className="confirm-modal-background">
                    <div className="confirm-modal">
                        <div className="flex items-center justify-center" style={{borderBottom: "1px solid black", backgroundColor: "#cccccc", width: "100%"}}>
                            <h1 style={{fontSize: "14px", textAlign: "center", width: "86%", padding: "8px 0px"}}><b>Desktop Required</b></h1>
                        </div>
                        <div style={{padding: "18px"}}>
                            <p>This drawing application requires a mouse and desktop environment. Please access it from a laptop or desktop computer for the best experience.</p>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
