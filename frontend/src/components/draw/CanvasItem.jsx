import { useContext, useEffect, useState, useRef } from "react";
import DrawContext from "../../context/draw/DrawContext";

export default function CanvasItem(props) {

    const canvasItemRef = useRef(null);

    const { canvasRef, undoStack, redoStack } = useContext(DrawContext);

    const [imageUrl, setImageUrl] = useState(null);

    const handleDrawFromHere = () => {
        if (!imageUrl) return;
        props.setShowUndoRedoHistoryModal(false);

        undoStack.current = [];
        redoStack.current = [];

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            const imgAspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;

            let drawWidth, drawHeight;

            if(imgAspect>canvasAspect){
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgAspect;
            }else{
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgAspect;
            }

            const offsetX = (canvas.width - drawWidth) / 2;
            const offsetY = (canvas.height - drawHeight) / 2;

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    }

    useEffect(() => {
        // create off screen canvas html element, make the canvas width and height same as the image data's width and height, 
        // put image data in off screen canvas, then convert the off screen canvas image data into image url
        // upload image url in on screen canvas
        const offScreenCanvas = document.createElement("canvas");
        offScreenCanvas.width = props.imageData.width;
        offScreenCanvas.height = props.imageData.height;

        const offScreenCtx = offScreenCanvas.getContext("2d", { willReadFrequently: true });
        offScreenCtx.putImageData(props.imageData, 0, 0);

        const image_url = offScreenCanvas.toDataURL("image/jpeg");
        setImageUrl(image_url);

        const canvas = canvasItemRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const img = new Image();
        img.src = image_url;

        img.onload = () => {
            const imgAspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;

            let drawWidth, drawHeight;

            if(imgAspect>canvasAspect){
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgAspect;
            }else{
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgAspect;
            }

            const offsetX = (canvas.width - drawWidth) / 2;
            const offsetY = (canvas.height - drawHeight) / 2;

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div className="mb-2">
            <button className="action-btn" onClick={handleDrawFromHere}>Draw from here</button>
            <canvas ref={canvasItemRef} width={250} height={150}></canvas>
        </div>
    );
}