import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ColorPaletteNameForm from "./ColorPaletteNameForm";

export default function GenerateColorPalette(props) {

  let navigate = useNavigate();

  const fileInputRef = useRef(null);
  const colorPaletteCanvasRef = useRef(null);
  
  const { showProgress } = useContext(ProgressBarContext);
  const { showAlert } = useContext(AlertContext);

  const [imageUploaded, setImageUploaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [colors, setColors] = useState([]);
  const [showColorPaletteNameFormModal, setShowColorPaletteNameFormModal] = useState(false);
  const [colorCopied,setColorCopied] = useState(false);
  const [copiedColor,setCopiedColor] = useState("");

  const generateColors = () => {
    // Step A: sample pixels
    let sample_pixels = samplePixels();
    // eg:
    // [
    //   { r: 255, g: 128, b: 64 },
    //   { r: 0, g: 200, b: 150 },
    //   { r: 100, g: 50, b: 75 },
    //   ...
    // ]

    // Step B: run K Means Clustering
    const final_colors = runKMeansClustering(sample_pixels);

    // Step C: produce hex colors array
    const hexColorsArray = final_colors.map((color) => rgbToHex(color.r, color.g, color.b));

    setColors(hexColorsArray);
    setImageLoaded(false);
  }

  const samplePixels = () => {
    const canvas = colorPaletteCanvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const sample_pixels = [];
    const SAMPLE_STEP = 3;

    for(let y = 0; y < canvas.height; y += SAMPLE_STEP){
      for(let x = 0; x < canvas.width; x += SAMPLE_STEP){
        const index = (y * canvas.width + x) * 4;
        const a = pixels[index + 3];
        if(a < 128){
          // skip transparent-ish pixel
          continue;
        }
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        sample_pixels.push({ r, g, b });
      }
    }
    return sample_pixels;
  }

  const runKMeansClustering = (pixels) => {

    // 1. Pick 12 random pixels as initial centroids
    let centroids = [];
    const used = new Set(); // to track if same pixel is chosen as the centroid
    while(centroids.length < 12){
      const random_pixel_index = Math.floor(Math.random() * pixels.length);
      if(!used.has(random_pixel_index)){
        used.add(random_pixel_index);
        centroids.push({ ...pixels[random_pixel_index] }); // push {r, g, b} of random pixel not just its index
      }
    }

    let pixelAssignedToWhichCentroid = new Array(pixels.length);

    // 2. Assign each pixel to nearest centroid, compute average of each cluster, compute new centroids and track movement of pixels
    for(let iteration = 0; iteration < 20; iteration++){

      // 2.1 Assign each pixel to nearest centroid
      for(let i = 0; i < pixels.length; i++){
        let bestCentroidIndex = 0;
        let bestDifference = Infinity;
        for(let centroidIndex = 0; centroidIndex < 12; centroidIndex++){
          const differenceOfRGBValues = calculateDifferenceOfRGBValues(pixels[i], centroids[centroidIndex]);
          if(differenceOfRGBValues < bestDifference){
            bestDifference = differenceOfRGBValues;
            bestCentroidIndex = centroidIndex;
          }
        }
        pixelAssignedToWhichCentroid[i] = bestCentroidIndex; // i represents index of nth pixel, so assigning best centroid index (0-11) to pixel in ith index 
      }

      // 2.2 Compute average of each cluster
      const sums = Array.from({ length: 12 }, () => ({
        r: 0, g: 0, b: 0, count: 0
      })); // sums = [{r:0,g:0,b:0,count:0},{r:0,g:0,b:0,count:0},...] i.e each cluster's sum value of r, g, b and count: number of pixels being assigned to that cluster

      for(let index = 0; index < pixels.length; index++){
        const centroidIndex = pixelAssignedToWhichCentroid[index];
        sums[centroidIndex].r += pixels[index].r;
        sums[centroidIndex].g += pixels[index].g;
        sums[centroidIndex].b += pixels[index].b;
        sums[centroidIndex].count += 1;
      }

      // compute new centroids, and track movement of pixels
      let movement = 0;

      for(let centroidIndex = 0; centroidIndex < 12; centroidIndex++){
        if (sums[centroidIndex].count === 0) continue;

        const newR = sums[centroidIndex].r / sums[centroidIndex].count; // average value of r of cluster having centroid at index (0-12) divided by total number of pixels assigned to that cluster
        const newG = sums[centroidIndex].g / sums[centroidIndex].count;
        const newB = sums[centroidIndex].b / sums[centroidIndex].count;

        movement += Math.abs(centroids[centroidIndex].r - newR);
        movement += Math.abs(centroids[centroidIndex].g - newG);
        movement += Math.abs(centroids[centroidIndex].b - newB);

        centroids[centroidIndex] = { r: newR, g: newG, b: newB };
      }

      // stop early if centroids barely moved
      if (movement < 0.5) break;
    }

    // 3. convert centroids to final colors
    const final_colors = centroids.map(centroid => ({
      r: Math.round(centroid.r),
      g: Math.round(centroid.g),
      b: Math.round(centroid.b)
    }));

    return final_colors;
  }

  const calculateDifferenceOfRGBValues = (p1, p2) => {
    const distance_r = p1.r - p2.r;
    const distance_g = p1.g - p2.g;
    const distance_b = p1.b - p2.b;
    return distance_r * distance_r + distance_g * distance_g + distance_b * distance_b; // (distance_r)² + (distance_g)² + (distance_b)² keeps all distances positive
  }

  const rgbToHex = (r, g, b) => {
    const rr = Math.round(r).toString(16).padStart(2, "0");
    const gg = Math.round(g).toString(16).padStart(2, "0");
    const bb = Math.round(b).toString(16).padStart(2, "0");
    return "#" + rr.toUpperCase() + gg.toUpperCase() + bb.toUpperCase();
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    
    // file validation
    const validTypes = ["image/png", "image/jpeg"];
    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (!validTypes.includes(file.type)) {
      showAlert("Warning", "Only PNG and JPEG images are allowed!");
      fileInputRef.current.value = ""; 
      return;
    }
    
    if (file.size > maxSizeBytes) {
      showAlert("Warning", `Image size must be less than ${maxSizeMB} MB!`);
      fileInputRef.current.value = "";
      return;
    }
    
    setImageUploaded(true);
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        drawImageToCanvas(img);
        setImageLoaded(true);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  const drawImageToCanvas = (img) => {
    const canvas = colorPaletteCanvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight;

    if (imgAspect>canvasAspect){
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

  const clearAll = () => {
    setColors([]);
    setImageUploaded(false);
    setImageLoaded(false);
    if(colorPaletteCanvasRef.current){
      const ctx = colorPaletteCanvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, colorPaletteCanvasRef.current.width, colorPaletteCanvasRef.current.height);
    }
    if(fileInputRef.current){
      fileInputRef.current.value = "";
    }
  }

  const calculateBrightness = (hexColor)=> {
    let color_without_hash = hexColor.replace("#", "");

    const r = parseInt(color_without_hash.substring(0, 2), 16);
    const g = parseInt(color_without_hash.substring(2, 4), 16);
    const b = parseInt(color_without_hash.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    if(colorCopied===true && copiedColor===hexColor){
      return brightness>128?"/copied-black.png":"/copied-white.png";
    }else{
      return brightness>128?"/copy-black.png":"/copy-white.png";
    }
  }

  const handleCopy = (color) => {
    setColorCopied(true);
    setCopiedColor(color);
    navigator.clipboard.writeText(color);
    showAlert("Success", `${color} copied to clipboard!`);
    setTimeout(() => {
      setColorCopied(false);
      setCopiedColor("");
    }, 2000);
  }

  const handleSavingColorPalette = (e) => {
    e.preventDefault();
    if(fileInputRef.current.value!==""){
      setShowColorPaletteNameFormModal(true);
    }else{
      showAlert("Warning", "Please select an image and generate color palette before saving it!");
      return;
    }
  }

  const addBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("adminSignedIn")){
      navigate("/");
    }
    
    if(localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")){
      showProgress();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(imageLoaded===true){
      generateColors();
    }
  }, [imageLoaded]);

  return (
    <>
      <div className={localStorage.getItem("userSignedIn")&&localStorage.getItem("user_token")?"content gap-8":"flex items-center justify-center gap-8"}>
        <div className="auth-form-box">
          <div style={{padding: "8px 0px", height: "38px", borderBottom: "1px solid black", backgroundColor: "#ccc"}}>
          </div>
          <div style={{height: "504px", width: "304px", padding: "12px"}}>
              {
                colors.length !== 0 ?
                  <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyItems: "center", gap: "12px"}}>
                    {colors.map((a_color, index)=>{
                      return  <div key={index} style={{height: "100px", width: "85px", border: "1px solid black"}}>
                                <div style={{display: "flex", justifyContent: "right", padding: "4px", height:"78px", backgroundColor: `${a_color}`}} title={`${a_color}`}>
                                  <img src={calculateBrightness(a_color)} alt="copy icon" style={{height: "18px", width: "18px", cursor: "pointer"}} onClick={()=>{handleCopy(a_color)}}/>
                                </div>
                                <p style={{padding: "0px 4px", fontSize: "12px", height: "20px", backgroundColor: "white"}}>{a_color}</p>
                              </div>
                    })}
                  </div>
                :
                  <div className="flex justify-center items-center" style={{height: "100%"}}>
                    <p style={{fontSize: "13px", textAlign: "center"}}><b>Upload image to generate color palette!</b></p>
                  </div>
              }
            <div className="flex justify-center">
              <button className="action-btn" style={{marginTop: "12px", cursor: "pointer", opacity: `${colors.length>1?"1":"0"}`}} onClick={clearAll}>clear all</button>
            </div>
          </div>
        </div>
        <div className="auth-form-box">
          {
            localStorage.getItem("adminSignedIn") && localStorage.getItem("admin_token") ?
              <div className="flex items-center justify-center" style={{borderBottom: "1px solid black", backgroundColor: "#ccc", width: "100%"}}>
                <h1 style={{fontSize: "14px", textAlign: "center", width: "86%", padding: "8px 0px", borderRight: "1px solid black"}}><b>Generate color palette</b></h1>
                <div style={{margin: "0px 5px 0px 10px", cursor: "pointer"}} onClick={()=>{props.setShowGenerateColorPaletteModal(false)}}>
                  <img src="/close.png" alt="close icon" style={{height: "14px", width: "14px"}}/>
                </div>
              </div>
            :
              <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Generate color palette</b></h1>
          }
          <form className="auth-form">
            <div style={{marginBottom: "28px"}}>
              <label><b>Upload image</b></label>
              <div className="input-bar mb-3" id="image-url-input-bar">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFile} onFocus={()=>{addBorderHighlight("image-url")}} onBlur={()=>{removeBorderHighlight("image-url")}} style={{color: `${imageUploaded?"black":"rgba(0, 0, 0, 0.6)"}`, fontSize: "13px"}}/>
                <img src="/close.png" alt="close icon" onClick={clearAll} style={{opacity: `${imageUploaded?"1":"0"}`}}/>
              </div>
              {
                imageUploaded ?
                  <canvas ref={colorPaletteCanvasRef} height={"160px"} width={"284px"}></canvas>
                :
                  <div className="flex items-center justify-center" style={{height: "160px", width: "100%", border: "1px solid rgba(0, 0, 0, 0.3)"}}>
                    <img src="no-image.png" alt="no image uploaded" style={{height: "24px", width: "24px"}}/>
                  </div>
              }
            </div>
            <button className="submit-btn" onClick={handleSavingColorPalette}>Save color palette</button>
          </form>
        </div>
      </div>

      {
        showColorPaletteNameFormModal
        &&
        <div className="confirm-modal-background">
          <ColorPaletteNameForm colors={colors} setShowColorPaletteNameFormModal={setShowColorPaletteNameFormModal} setShowGenerateColorPaletteModal={props.setShowGenerateColorPaletteModal}/>
        </div>
      }
    </>
  );
}