import { useContext, useEffect, useState } from "react";
import DrawContext from '../draw/DrawContext';
import CursorContext from "./CursorContext";

export default function CursorState(props) {

    const { tool } = useContext(DrawContext);

    const [cursor, setCursor] = useState(null);
    const [cursorImg, setCursorImg] = useState(false);
    
    const handleCursor = (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursor) {
            cursor.style.left = `${posX}px`;
            cursor.style.top = `${posY}px`;
        }
    };

    const handleCanvasEnter = () => {
        if (cursor) {
            setCursorImg(true);
        }
    }
    
    const handleCanvasLeave = () => {
        if (cursor) {
            setCursorImg(false);
        }
    }

    useEffect(() => {
        setCursor(document.getElementById("cursor"));

        window.addEventListener("mousemove", handleCursor);

        return () => {
            window.removeEventListener("mousemove", handleCursor);
        };
        // eslint-disable-next-line
    }, [cursor]);

    return(
        <>
            <CursorContext.Provider value={{handleCanvasEnter, handleCanvasLeave}}>
                {props.children}
            </CursorContext.Provider>

            <div id="cursor" className="cursor">
                {
                    cursorImg
                    &&
                    <img src={`/${tool==="pen" || tool==="eraser" || tool==="bucket" || tool==="bucketeraser" || tool==="text"?tool==="bucketeraser"?"eraser.png":tool+".png":"plus.png"}`} style={{height: "32px", width: "32px"}}/>
                }
            </div>
        </>
    );
}