import { useContext, useState, useRef } from "react";
import AlertContext from "../alert/AlertContext";
import ConfirmContext from "../confirm/ConfirmContext";
import DrawContext from "./DrawContext";

export default function DrawState(props) {

  const canvasRef = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const BeforeShapeCanvasStateImageDataRef = useRef(null);
  const shapeStartPointRef = useRef(null);

  const { showAlert } = useContext(AlertContext);
  const { showConfirm } = useContext(ConfirmContext);

  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pen");
  const [penStrokeWidth, setPenStrokeWidth] = useState(2);
  const [eraserStrokeWidth, setEraserStrokeWidth] = useState(4);
  const [penColor, setPenColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState("24");
  const [textFont, setTextFont] = useState("serif");
  const [text, setText] = useState("");
  const [fetchedDrawings, setFetchedDrawings] = useState([]);
  const [colorOpacity, setColorOpacity] = useState(255);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // find the mouse position relative to the canvas not the whole screen
    const canvasBox = canvas.getBoundingClientRect();
    // posX and posY are floating-point numbers
    const posX = e.clientX - canvasBox.left; // posX is horizontal axis
    const posY = e.clientY - canvasBox.top; // posY is vertical axis

    // save the previous canvas state before canvas is modified
    undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    // empty redo stack when the user clicks undo and modifies canvas
    redoStack.current = [];

    if(tool==="pen"){
      setDrawing(true);
      ctx.beginPath();
      ctx.moveTo(posX, posY);
      ctx.strokeStyle = convertHexToRgba(penColor);
      ctx.lineWidth = penStrokeWidth;
      ctx.lineCap = "round";
    }else if(tool==="eraser") {
      setDrawing(true);
      ctx.beginPath();
      ctx.moveTo(posX, posY);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = eraserStrokeWidth;
      ctx.lineCap = "round";
    }else if(tool==="bucket") {
      const rgbaColor = convertHexToRgba(penColor);
      floodFill(Math.floor(posX), Math.floor(posY), rgbaColor); // Math.floor() removes decimal and rounds down number to nearest integer
    }else if(tool==="bucketeraser") {
      const rgbaColor = convertHexToRgba("#ffffff");
      floodFill(Math.floor(posX), Math.floor(posY), rgbaColor);
    }else if(tool==="text"){
      ctx.font = textSize + "px " + textFont;
      ctx.fillStyle = convertHexToRgba(textColor);
      if(text===""){
        showAlert("Warning", "Please enter some text!");
      }else if(textSize<12){
        showAlert("Warning", "Text size cannot be less than 12!");
      }else{      
        ctx.fillText(text, posX, posY);
      }
    }else if(tool==="line" || tool==="circle" || tool==="square" || tool==="rectangle" || tool==="triangle" || tool==="upparabola" || tool==="downparabola" || tool==="ellipse" || tool==="parallelogram" || tool==="star" || tool==="heart"){
      setDrawing(true);
      BeforeShapeCanvasStateImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      shapeStartPointRef.current = [posX, posY];
    }
  }

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const canvasBox = canvas.getBoundingClientRect();
    const posX = e.clientX - canvasBox.left;
    const posY = e.clientY - canvasBox.top;

    if(drawing===true && (tool==="pen" || tool==="eraser")){
      ctx.lineTo(posX, posY);
      ctx.stroke();
    }else if(drawing===true && (tool==="line" || tool==="circle" || tool==="square" || tool==="rectangle" || tool==="triangle" || tool==="upparabola" || tool==="downparabola" || tool==="ellipse" || tool==="parallelogram" || tool==="star" || tool==="heart")){
      ctx.putImageData(BeforeShapeCanvasStateImageDataRef.current, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = convertHexToRgba(penColor);
      ctx.lineWidth = penStrokeWidth;

      const startX = shapeStartPointRef.current[0];
      const startY = shapeStartPointRef.current[1];
      const width = posX - startX;
      const height = posY - startY;

      if(tool==="line"){
        bresenhamLine(startX, startY, posX, posY, convertHexToRgba(penColor)); 
      }else if(tool==="circle"){
        const radius = Math.hypot(width, height);
        midpointCircle(Math.floor(startX), Math.floor(startY), Math.floor(radius), convertHexToRgba(penColor));
      }else if(tool==="square"){
        const size = Math.min(Math.abs(width), Math.abs(height));
        ctx.rect(startX, startY, width < 0 ? -size : size, height < 0 ? -size : size);
      }else if(tool==="rectangle"){
        ctx.rect(startX, startY, width, height);
      }else if(tool==="triangle"){
        const midX = startX + width / 2;
        ctx.moveTo(midX, startY); // top vertex
        ctx.lineTo(startX, startY + height); // bottom left vertex
        ctx.lineTo(startX + width, startY + height); // bottom right vertex
        ctx.closePath();
      }else if(tool==="upparabola"){
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX, startY + 100, posX, startY + 100, posX, posY);
      }else if(tool==="downparabola"){
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX, startY - 100, posX, startY - 100, posX, posY);
      }else if(tool==="ellipse"){
        const cx = startX + width / 2;
        const cy = startY + height / 2;
        const rx = Math.abs(width / 2);
        const ry = Math.abs(height / 2);
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      }else if(tool==="parallelogram"){
        const offsetX = width / 5;
        ctx.moveTo(startX + offsetX, startY);
        ctx.lineTo(posX + offsetX, startY);
        ctx.lineTo(posX - offsetX, posY);
        ctx.lineTo(startX - offsetX, posY);
        ctx.closePath();
      }else if(tool==="star"){
        const outerRadius = Math.hypot(width, height) / 2;
        const innerRadius = outerRadius / 2.5;
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          if(i === 0){
            ctx.moveTo(x, y);
          }else{
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
      }else if(tool==="heart"){
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const topCurveHeight = height * 0.3;
        const sideCurveWidth = width * 0.3;
        ctx.moveTo(centerX, startY + topCurveHeight);
        ctx.bezierCurveTo(centerX - sideCurveWidth / 2, startY - topCurveHeight, startX, centerY - topCurveHeight / 2, centerX, startY + height);
        ctx.bezierCurveTo(posX, centerY - topCurveHeight / 2, centerX + sideCurveWidth / 2, startY - topCurveHeight, centerX, startY + topCurveHeight);
        ctx.closePath();
      }
      if(tool!=="line" && tool!=="circle"){
        ctx.stroke();
      }
    }else{
      return;
    }
  }

  const handleMouseUp = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const canvasBox = canvas.getBoundingClientRect();
    const posX = e.clientX - canvasBox.left;
    const posY = e.clientY - canvasBox.top;

    if(tool==="pen" || tool==="eraser" || tool==="line" || tool==="circle" || tool==="square" || tool==="rectangle" || tool==="triangle" || tool==="upparabola" || tool==="downparabola" || tool==="ellipse" || tool==="parallelogram" || tool==="star" || tool==="heart"){
      setDrawing(false);
      if(tool==="line" || tool==="circle" || tool==="square" || tool==="rectangle" || tool==="triangle" || tool==="upparabola" || tool==="downparabola" || tool==="ellipse" || tool==="parallelogram" || tool==="star" || tool==="heart"){
        ctx.putImageData(BeforeShapeCanvasStateImageDataRef.current, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = convertHexToRgba(penColor);
        ctx.lineWidth = penStrokeWidth;

        const startX = shapeStartPointRef.current[0];
        const startY = shapeStartPointRef.current[1];
        const width = posX - startX;
        const height = posY - startY;

        if(tool==="line"){
          bresenhamLine(startX, startY, posX, posY, convertHexToRgba(penColor));
        }else if(tool==="circle"){
          const radius = Math.hypot(width, height);
          midpointCircle(Math.floor(startX), Math.floor(startY), Math.floor(radius), convertHexToRgba(penColor));
        }else if(tool==="square"){
          const size = Math.min(Math.abs(width), Math.abs(height));
          ctx.rect(startX, startY, width < 0 ? -size : size, height < 0 ? -size : size);
        }else if(tool==="rectangle"){
          ctx.rect(startX, startY, width, height);
        }else if(tool==="triangle"){
          const midX = startX + width / 2;
          ctx.moveTo(midX, startY);
          ctx.lineTo(startX, startY + height);
          ctx.lineTo(startX + width, startY + height);
          ctx.closePath();
        }else if(tool==="upparabola"){
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(startX, startY + 100, posX, startY + 100, posX, posY);
        }else if(tool==="downparabola"){
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(startX, startY - 100, posX, startY - 100, posX, posY);
        }else if(tool==="ellipse"){
          const cx = startX + width / 2;
          const cy = startY + height / 2;
          const rx = Math.abs(width / 2);
          const ry = Math.abs(height / 2);
          ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        }else if(tool==="parallelogram"){
          const offsetX = width / 5;
          ctx.moveTo(startX + offsetX, startY);
          ctx.lineTo(posX + offsetX, startY);
          ctx.lineTo(posX - offsetX, posY);
          ctx.lineTo(startX - offsetX, posY);
          ctx.closePath();
        }else if(tool==="star"){
          const outerRadius = Math.hypot(width, height) / 2;
          const innerRadius = outerRadius / 2.5;
          const centerX = startX + width / 2;
          const centerY = startY + height / 2;
          for (let i = 0; i < 10; i++) {
            const angle = (Math.PI / 5) * i - Math.PI / 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if(i === 0){
              ctx.moveTo(x, y);
            }else{
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
        }else if(tool==="heart"){
          const centerX = startX + width / 2;
          const centerY = startY + height / 2;
          const topCurveHeight = height * 0.3;
          const sideCurveWidth = width * 0.3;
          ctx.moveTo(centerX, startY + topCurveHeight);
          ctx.bezierCurveTo(centerX - sideCurveWidth / 2, startY - topCurveHeight, startX, centerY - topCurveHeight / 2, centerX, startY + height);
          ctx.bezierCurveTo(posX, centerY - topCurveHeight / 2, centerX + sideCurveWidth / 2, startY - topCurveHeight, centerX, startY + topCurveHeight);
          ctx.closePath();
        }
        if(tool!=="line"  && tool!=="circle"){
          ctx.stroke();
        }
      }
    }
  }

  const bresenhamLine = (x1, y1, x2, y2, color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const drawPixel = (x, y) => {
      const half = Math.floor(penStrokeWidth / 2);
      for (let i = -half; i <= half; i++) {
        for (let j = -half; j <= half; j++) {
          const px = x + i;
          const py = y + j;
          if(px < 0 || py < 0 || px >= canvas.width || py >= canvas.height){
            continue;
          }
          setPixelColor(pixels, px, py, canvas.width, color);
        }
      }
    }

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let xinc = x1 > x2 ? -1 : 1;
    let yinc = y1 > y2 ? -1 : 1;
    let step = dx > dy ? dx : dy;
    
    let x = x1;
    let y = y1;
    let i = 0;
    let p;

    drawPixel(x,y);

    if(dx>dy){
      p = 2*dy - dx;
      while(i<step){
        x = x + xinc;
        if(p<0){
          p = p + 2*dy;
        }else{
          y = y + yinc;
          p = p + 2*dy - 2*dx;
        }
        drawPixel(x,y);
        i++;
      }
    }else if(dy>dx){
      p = 2*dx - dy;
      while(i<step){
        y = y + yinc;
        if(p<0){
          p = p + 2*dx;
        }else{
          x = x + xinc;
          p = p + 2*dx - 2*dy;
        }
        drawPixel(x,y);
        i++;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  const midpointCircle = (xc, yc, radius, color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const drawPixel = (x, y) => {
      const half = Math.floor(penStrokeWidth / 2);
      for (let i = -half; i <= half; i++) {
        for (let j = -half; j <= half; j++) {
          const px = x + i;
          const py = y + j;
          if(px < 0 || py < 0 || px >= canvas.width || py >= canvas.height){
            continue;
          }
          setPixelColor(pixels, px, py, canvas.width, color);
        }
      }
    }

    let x = 0;
    let y = radius;
    let p = 1 - radius;

    const drawCirclePoints = (xc, yc, x, y) => {
      drawPixel(xc + x, yc + y);
      drawPixel(xc - x, yc + y);
      drawPixel(xc + x, yc - y);
      drawPixel(xc - x, yc - y);
      drawPixel(xc + y, yc + x);
      drawPixel(xc - y, yc + x);
      drawPixel(xc + y, yc - x);
      drawPixel(xc - y, yc - x);
    }

    drawCirclePoints(xc, yc, x, y);

    while(x<y){
      x++;
      if(p<0){
        p = p + 2*x + 1;
      }else if(p>=0){
        y--;
        p = p + 2*x - 2*y + 1;
      }
      drawCirclePoints(xc, yc, x, y);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  const floodFill = (posX, posY, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // getImageData() is used to read the pixel data from the canvas
    // read pixel data of the canvas from imageData and store it in an array named pixels
    const pixels = imageData.data; // pixels is the array of rgba values of each pixel [r,g,b,a,r,g,b,a,...] : 0,1,2,3 index is the rgba value of first pixel, 4,5,6,7 index is the rgba value of second pixel and so on... each pixel takes 4 positions

    const startPixelColor = getStartPixelColor(pixels, posX, posY, canvas.width);
    
    if(!doesStartPixelColorMatchFillColor(startPixelColor, fillColor)){
      const stack = [[posX, posY]];

      while (stack.length!==0) {
        const [pixX, pixY] = stack.pop();
        
        if(pixX<0 || pixY<0 || pixX>=canvas.width || pixY>=canvas.height){
          continue;
        }

        const neighbourPixelColor = getPixelColor(pixels, pixX, pixY, canvas.width);

        if(doesNeighbourPixelColorMatchStartPixelColor(neighbourPixelColor, startPixelColor) && !doesNeighbourPixelColorMatchFillColor(neighbourPixelColor, fillColor)){ // if neighbour pixel color is start pixel color and neighbour pixel color do not match fill color then set neighbour pixel color to fill color
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

  const getStartPixelColor = (pixels, posX, posY, width) => {
    // for a pixel at posX and posY, index is the starting index i.e r component in the pixels array
    const index = (posY * width + posX) * 4;
    return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]]; // returns start pixel rgba value 
  }
  
  const getPixelColor = (pixels, pixX, pixY, width) => {
    const index = (pixY * width + pixX) * 4;
    return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
  }

  const setPixelColor = (pixels, pixX, pixY, width, fillColor) => {
    const index = (pixY * width + pixX) * 4;
    pixels[index] = fillColor[0];
    pixels[index + 1] = fillColor[1];
    pixels[index + 2] = fillColor[2];
    pixels[index + 3] = fillColor[3];
  }

  const doesStartPixelColorMatchFillColor = (startPixelColor, fillColor) => {
    // compare startPixelColor [r,g,b,a] with fillColor [r,g,b,a]
    if(Math.abs(startPixelColor[0]-fillColor[0])<=5 && Math.abs(startPixelColor[1]-fillColor[1])<=5 && Math.abs(startPixelColor[2]-fillColor[2])<=5){
      return true;
    }else{
      return false;
    }
  }
  
  const doesNeighbourPixelColorMatchStartPixelColor = (neighbourPixelColor, startPixelColor) => {
    // compare neighbourPixelColor [r,g,b,a] with startPixelColor [r,g,b,a]
    if(Math.abs(neighbourPixelColor[0]-startPixelColor[0])<=5 && Math.abs(neighbourPixelColor[1]-startPixelColor[1])<=5 && Math.abs(neighbourPixelColor[2]-startPixelColor[2])<=5){
      return true;
    }else{
      return false;
    }
  }
  
  const doesNeighbourPixelColorMatchFillColor = (neighbourPixelColor, fillColor) => {
    // compare neighbourPixelColor [r,g,b,a] with fillColor [r,g,b,a]
    if(Math.abs(neighbourPixelColor[0]-fillColor[0])<=5 && Math.abs(neighbourPixelColor[1]-fillColor[1])<=5 && Math.abs(neighbourPixelColor[2]-fillColor[2])<=5){
      return true;
    }else{
      return false;
    }
  }

  const convertHexToRgba = (hexColor) => {
    let color_without_hash = hexColor.replace("#", "");

    const r = parseInt(color_without_hash.substring(0, 2), 16);
    const g = parseInt(color_without_hash.substring(2, 4), 16);
    const b = parseInt(color_without_hash.substring(4, 6), 16);

    return tool==="bucket" || tool==="bucketeraser" || tool==="line" || tool==="circle" ? [r, g, b, colorOpacity] : `rgba(${r},${g},${b},${colorOpacity/255})`; // value at index 3 is a(alpha) which represents opacity of color, 255 means fully opaque, while 0 means fully transparent, also when 255/255=1 fully opaque, 128/255=0.502 half transparent and 0/255=0 fully transparent
  }

  const handleClearCanvas = async() => {
    let ans = await showConfirm("Clear canvas");
    if(ans){
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      showAlert("Success", "You've cleared canvas!");
    }
  }

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if(undoStack.current.length>0){
      redoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      let prevCanvasStateImageData = undoStack.current.pop();
      ctx.putImageData(prevCanvasStateImageData, 0, 0);
    }
  }

  const handleRedo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if(redoStack.current.length>0){
      undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      let nextCanvasStateImageData = redoStack.current.pop();
      ctx.putImageData(nextCanvasStateImageData, 0, 0);
    }
  }

  const handleExport = (drawing_title, export_type) => {
    const canvas = canvasRef.current;
    const drawingURL = canvas.toDataURL("image/"+export_type);
    const link = document.createElement("a");
    link.href = drawingURL;
    link.download = drawing_title;
    link.click();
  }

  const fetchDrawing = async() => {
    try{
      const response = await fetch(`http://localhost:5000/api/drawing/fetchdrawing`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user_id": localStorage.getItem("user_id")
        }
      });
      const json = await response.json();

      if(json.success){
        setFetchedDrawings(json.fetchedDrawings);
      }else{
        showAlert("Error", json.error);
      }
    }catch(err){
      showAlert("Error", "Network error. Please check your connection or try again later!");
    }
  }

  return (
    <DrawContext.Provider value={{ canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, setTool, tool, penColor, textColor, setPenColor, setTextColor, handleClearCanvas, handleUndo, handleRedo, fetchDrawing, fetchedDrawings, setPenStrokeWidth, setEraserStrokeWidth, handleExport, setTextSize, setTextFont, setText, setColorOpacity, undoStack, redoStack }}>
      {props.children}
    </DrawContext.Provider>
  );
}