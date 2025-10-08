import { useState, useRef } from "react";
import DrawContext from "./DrawContext";

export default function DrawState(props) {

  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [selectedColor, setSelectedColor] = useState("#000000");

  const canvasRef = useRef(null);

  const handleMouseDown = (e)=> {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // find the mouse position relative to the canvas not the whole screen
    const canvasBox = canvas.getBoundingClientRect();
    // posX and posY are floating-point numbers
    const posX = e.clientX - canvasBox.left; // posX is horizontal axis
    const posY = e.clientY - canvasBox.top; // posY is vertical axis

    if(tool==="pen"){
      setDrawing(true);
      ctx.beginPath();
      ctx.moveTo(posX, posY);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }else if(tool==="eraser") {
      setDrawing(true);
      ctx.beginPath();
      ctx.moveTo(posX, posY);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
    }else if(tool==="bucket fill") {
      const rgbaColor = convertHexToRgba("#fbe319");
      floodFill(Math.floor(posX), Math.floor(posY), rgbaColor); // Math.floor() removes decimal and rounds down number to nearest integer
    }else if(tool==="bucket eraser") {
      const rgbaColor = convertHexToRgba("#ffffff");
      floodFill(Math.floor(posX), Math.floor(posY), rgbaColor);
    }
  }

  const handleMouseMove = (e)=> {
    if (drawing===true && (tool==="pen" || tool==="eraser")){
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const canvasBox = canvas.getBoundingClientRect();
      const posX = e.clientX - canvasBox.left;
      const posY = e.clientY - canvasBox.top;
      ctx.lineTo(posX, posY);
      ctx.stroke();
    }else{
      return;
    }
  }

  const handleMouseUp = ()=> {
    if (tool==="pen" || tool==="eraser"){
      setDrawing(false);
    }
  }

  const floodFill = (posX, posY, fillColor)=> {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // imageData is the memory that stores canvas info
    // read pixel data of the canvas from imageData and store it in an array named pixels
    const pixels = imageData.data; // pixels is the array of rgba values of each pixel [r,g,b,a,r,g,b,a,...] : 0,1,2,3 index is the rgba value of first pixel, 4,5,6,7 index is the rgba value of second pixel and so on...

    const startPixelColor = getStartPixelColor(pixels, posX, posY, canvas.width);
    
    if (!doesStartPixelColorMatchFillColor(startPixelColor, fillColor)){
      const stack = [[posX, posY]];

      while (stack.length!==0){
        const [pixX, pixY] = stack.pop();
        
        if (pixX<0 || pixY<0 || pixX>=canvas.width || pixY>=canvas.height){
          continue;
        }

        const neighbourPixelColor = getPixelColor(pixels, pixX, pixY, canvas.width);

        if (doesNeighbourPixelColorMatchStartPixelColor(neighbourPixelColor, startPixelColor)){
          setPixelColor(pixels, pixX, pixY, canvas.width, fillColor);
          stack.push([pixX + 1, pixY]); // push position of right pixel into the stack
          stack.push([pixX - 1, pixY]); // push position of left pixel into the stack
          stack.push([pixX, pixY + 1]); // push position of bottom pixel into the stack
          stack.push([pixX, pixY - 1]); // push position of top pixel into the stack
        }
      }
    }else{
      return;
    }

    ctx.putImageData(imageData, 0, 0); // update the canvas with changes made in pixels array
  }

  const getStartPixelColor = (pixels, posX, posY, width)=> {
    // for a pixel at posX and posY, i is the starting index i.e r component in the pixels array
    const i = (posY * width + posX) * 4;
    return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]]; // returns start pixel's rgba value 
  }
  
  const getPixelColor = (pixels, pixX, pixY, width)=> {
    const i = (pixY * width + pixX) * 4;
    return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
  }

  const setPixelColor = (pixels, pixX, pixY, width, fillColor) => {
    const i = (pixY * width + pixX) * 4;
    pixels[i] = fillColor[0];
    pixels[i + 1] = fillColor[1];
    pixels[i + 2] = fillColor[2];
    pixels[i + 3] = fillColor[3];
  }

  const doesStartPixelColorMatchFillColor = (startPixelColor, fillColor)=> {
    // compare startPixelColor [r,g,b,a] with fillColor [r,g,b,a]
    if (Math.abs(startPixelColor[0]-fillColor[0])<=100 && Math.abs(startPixelColor[1]-fillColor[1])<=100 && Math.abs(startPixelColor[2]-fillColor[2])<=100){
      return true;
    }else{
      return false;
    }
  }
  
  const doesNeighbourPixelColorMatchStartPixelColor = (neighbourPixelColor, startPixelColor)=> {
    // compare neighbourPixelColor [r,g,b,a] with startPixelColor [r,g,b,a]
    if (Math.abs(neighbourPixelColor[0]-startPixelColor[0])<=100 && Math.abs(neighbourPixelColor[1]-startPixelColor[1])<=100 && Math.abs(neighbourPixelColor[2]-startPixelColor[2])<=100){
      return true;
    }else{
      return false;
    }
  }

  const convertHexToRgba = (hexColor)=> {
    let color_without_hash = hexColor.replace("#", "");

    const r = parseInt(color_without_hash.substring(0, 2), 16);
    const g = parseInt(color_without_hash.substring(2, 4), 16);
    const b = parseInt(color_without_hash.substring(4, 6), 16);

    return [r, g, b, 255]; // value at index 3 is a(alpha) which represents opacity of color, 255 means fully opaque, while 0 means fully transparent
  }

  return(
    <DrawContext.Provider value={{ canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, setTool }}>
      {props.children}
    </DrawContext.Provider>
  )
}
