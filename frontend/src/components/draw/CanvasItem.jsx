import { useEffect, useRef } from "react";

export default function CanvasItem(props) {

    const canvasRef = useRef(null);

    useEffect(() => {
        // create off screen canvas html element, make the canvas width and height same as the image data's width and height, 
        // put image data in off screen canvas, then convert the off screen canvas image data into image url
        // upload image url in on screen canvas
        const offScreenCanvas = document.createElement("canvas");
        offScreenCanvas.width = props.imageData.width;
        offScreenCanvas.height = props.imageData.height;

        const offScreenCtx = offScreenCanvas.getContext("2d", { willReadFrequently: true });
        offScreenCtx.putImageData(props.imageData, 0, 0);

        const imageUrl = offScreenCanvas.toDataURL("image/jpeg");

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

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
    }, []);

    return (
        <div style={{margin: "12px"}}>
            <canvas ref={canvasRef} width={250} height={150}></canvas>
        </div>
    );
}