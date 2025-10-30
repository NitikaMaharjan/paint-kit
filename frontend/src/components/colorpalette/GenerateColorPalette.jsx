import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBarContext from "../../context/progressbar/ProgressBarContext";
import AlertContext from "../../context/alert/AlertContext";
import ColorPaletteNameForm from "./ColorPaletteNameForm";

export default function GenerateColorPalette() {

  let navigate = useNavigate();

  const DEFAULT_K = 32;
  const MAIN_COLS = 12;
  const STEP = 3;
  const ITERS = 20;
  const MAX_SAMPLES = 60000;

  const fileInputRef = useRef(null);
  const colorPaletteCanvasRef = useRef(null);

  const { showAlert } = useContext(AlertContext);
  const { showProgress } = useContext(ProgressBarContext);

  const [palette, setPalette] = useState([]);
  const [colors, setColors] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showColorPaletteNameFormModal, setShowColorPaletteNameFormModal] = useState(false);
  const [colorCopied,setColorCopied] = useState(false);
  const [copiedColor,setCopiedColor] = useState("");

  const toHex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

  const rgbToXyz = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    return [x, y, z];
  };

  const xyzToLab = (x, y, z) => {
    const xr = x / 0.95047;
    const yr = y / 1.0;
    const zr = z / 1.08883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787037 * t + 16 / 116);
    const fx = f(xr),
      fy = f(yr),
      fz = f(zr);
    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const b = 200 * (fy - fz);
    return [L, a, b];
  };

  const rgbToLab = (r, g, b) => xyzToLab(...rgbToXyz(r, g, b));
  const distLab = (a, b) =>
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

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
  };

  const samplePixels = (step) => {
    const canvas = colorPaletteCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width: w, height: h } = canvas;
    const data = ctx.getImageData(0, 0, w, h).data;
    const pixels = [];
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4;
        const a = data[i + 3];
        if (a < 128) continue;
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        const lab = rgbToLab(r, g, b);
        pixels.push({ r, g, b, lab });
      }
    }
    return pixels;
  };

  const kmeans = (pixels, K, maxIter) => {
    const N = pixels.length;
    if (N === 0) return null;
    K = Math.min(K, N);

    const centroids = [];
    const used = new Set();
    while (centroids.length < K) {
      const idx = Math.floor(Math.random() * N);
      if (used.has(idx)) continue;
      used.add(idx);
      centroids.push([...pixels[idx].lab]);
    }

    const assignments = new Int32Array(N);
    const counts = new Int32Array(K);
    const sums = Array.from({ length: K }, () => [0, 0, 0]);

    for (let iter = 0; iter < maxIter; iter++) {
      counts.fill(0);
      sums.forEach((s) => s.fill(0));

      for (let i = 0; i < N; i++) {
        const lab = pixels[i].lab;
        let best = 0,
          bestDist = Infinity;
        for (let c = 0; c < K; c++) {
          const d = distLab(lab, centroids[c]);
          if (d < bestDist) {
            bestDist = d;
            best = c;
          }
        }
        assignments[i] = best;
        counts[best]++;
        sums[best][0] += pixels[i].r;
        sums[best][1] += pixels[i].g;
        sums[best][2] += pixels[i].b;
      }

      let shift = 0;
      for (let c = 0; c < K; c++) {
        if (counts[c] === 0) {
          const idx = Math.floor(Math.random() * N);
          centroids[c] = [...pixels[idx].lab];
          continue;
        }
        const newR = sums[c][0] / counts[c];
        const newG = sums[c][1] / counts[c];
        const newB = sums[c][2] / counts[c];
        const newLab = rgbToLab(newR, newG, newB);
        shift += distLab(centroids[c], newLab);
        centroids[c] = newLab;
      }
      if (shift < 1e-3) break;
    }

    const result = [];
    for (let c = 0; c < K; c++) {
      if (counts[c] === 0) continue;
      const avgR = Math.round(sums[c][0] / counts[c]);
      const avgG = Math.round(sums[c][1] / counts[c]);
      const avgB = Math.round(sums[c][2] / counts[c]);
      result.push({ avgR, avgG, avgB, count: counts[c] });
    }
    result.sort((a, b) => b.count - a.count);
    return { result, total: N };
  };

  

  const runSimpleKMeans = async () => {
    const canvas = colorPaletteCanvasRef.current;
    if (!canvas) return;

    const pixels = samplePixels(STEP);
    if (pixels.length === 0) {
      setPalette([]);
      return;
    }

    let sampled = pixels;
    if (pixels.length > MAX_SAMPLES) {
      sampled = [];
      const N = pixels.length;
      const indices = new Set();
      while (indices.size < MAX_SAMPLES)
        indices.add(Math.floor(Math.random() * N));
      for (const idx of indices) sampled.push(pixels[idx]);
    }

    const clusters = kmeans(sampled, DEFAULT_K, ITERS);
    if (!clusters) {
      setPalette([]);
      return;
    }

    let top = clusters.result.slice(0, Math.max(MAIN_COLS * 2, MAIN_COLS));
    const rgbToLabSimple = (obj) => rgbToLab(obj.avgR, obj.avgG, obj.avgB);
    const merged = [];
    const taken = new Array(top.length).fill(false);
    const THRESH = 25 * 25;

    for (let i = 0; i < top.length; i++) {
      if (taken[i]) continue;
      let base = top[i];
      let sumR = base.avgR * base.count;
      let sumG = base.avgG * base.count;
      let sumB = base.avgB * base.count;
      let sumCount = base.count;
      taken[i] = true;
      const labBase = rgbToLabSimple(base);

      for (let j = i + 1; j < top.length; j++) {
        if (taken[j]) continue;
        const labJ = rgbToLabSimple(top[j]);
        if (distLab(labBase, labJ) < THRESH) {
          taken[j] = true;
          sumR += top[j].avgR * top[j].count;
          sumG += top[j].avgG * top[j].count;
          sumB += top[j].avgB * top[j].count;
          sumCount += top[j].count;
        }
      }

      merged.push({
        avgR: Math.round(sumR / sumCount),
        avgG: Math.round(sumG / sumCount),
        avgB: Math.round(sumB / sumCount),
        count: sumCount,
      });

      if (merged.length >= MAIN_COLS) break;
    }

    if (merged.length < MAIN_COLS) {
      for (let i = 0; i < top.length && merged.length < MAIN_COLS; i++) {
        const m = merged.find(
          (x) => x.count === top[i].count && x.avgR === top[i].avgR
        );
        if (!m)
          merged.push({
            avgR: top[i].avgR,
            avgG: top[i].avgG,
            avgB: top[i].avgB,
            count: top[i].count,
          });
      }
    }

    merged.sort((a, b) => b.count - a.count);
    setPalette(
      merged.map((c) => ({ ...c, hex: toHex(c.avgR, c.avgG, c.avgB) }))
    );
    setImageLoaded(false);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        drawImageToCanvas(img);
        setImageLoaded(true); // triggers K-Means via useEffect
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const clearAll = () => {
    setPalette([]);
    setImageLoaded(false);
    if (colorPaletteCanvasRef.current) {
      const ctx = colorPaletteCanvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, colorPaletteCanvasRef.current.width, colorPaletteCanvasRef.current.height);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
    showAlert("Success", "Color copied to clipboard!");
    setTimeout(() => {
      setColorCopied(false);
      setCopiedColor("");
    }, 1500);
  }

  useEffect(() => {
    if(!localStorage.getItem("userSignedIn") && !localStorage.getItem("user_token")){
      navigate("/usersignin");
    }else{
      showProgress();
    }
    // eslint-disable-next-line
  }, []);

  // Run K-Means automatically when image is loaded
  useEffect(() => {
    if (imageLoaded) runSimpleKMeans();
  }, [imageLoaded]);

  useEffect(() => {
    if(palette.length!==0){
      const colorsArray = [];
      for(let i=0;i<12;i++){
        colorsArray.push(palette[i].hex);
      }
      setColors(colorsArray);
    }
  }, [palette]);  

  return (
    <>
      <div className="content gap-8">
        <div className="auth-form-box">
          <h1 style={{padding: "8px 0px", fontSize: "14px", textAlign: "center", borderBottom: "1px solid black", backgroundColor: "#ccc"}}><b>Generate color palette</b></h1>
          <div className="auth-form">
            <div style={{marginBottom: "20px"}}>
              <label>Upload Image</label>
              <div className="input-bar">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFile}/>
              </div>
            </div>
            <div>
              <canvas ref={colorPaletteCanvasRef} height={"200px"} width={"350px"}></canvas>
            </div>
          <button className="submit-btn" onClick={()=>{setShowColorPaletteNameFormModal(true)}}>Save color palette</button>
          </div>
        </div>
        <div className="auth-form-box">
          <div className="flex items-center justify-end" style={{padding: "8px 0px", height: "38px", borderBottom: "1px solid black", backgroundColor: "#ccc"}}>
              <img src="/close.png" title="clear all button" style={{height: "13px", width: "13px", cursor: "pointer", marginRight: "14px"}} onClick={clearAll}/>
          </div>
          <div style={{height: "448px", width: "304px", padding: "12px"}}>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyItems: "center", gap: "12px"}}>
              {palette.length !== 0 ?
                  palette.map((a_color, index)=>{
                    return  <div key={index} style={{height: "100px", width: "85px", border: "1px solid black"}}>
                              <div style={{display: "flex", justifyContent: "right", padding: "4px", height:"78px", backgroundColor: `${a_color.hex}`}} title={`${a_color.hex}`}>
                                <img src={calculateBrightness(a_color.hex)} alt="copy color button image" title="copy button" style={{height: "18px", width: "18px", cursor: "pointer"}} onClick={()=>{handleCopy(a_color.hex)}}/>
                              </div>
                              <p style={{padding: "0px 4px", fontSize: "12px", height: "20px", backgroundColor: "white"}}>{a_color.hex}</p>
                            </div>
                  })
                :
                <div></div>
              }
            </div>
          </div>
        </div>
      </div>
      {
        showColorPaletteNameFormModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowColorPaletteNameFormModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <ColorPaletteNameForm colors={colors} setShowColorPaletteNameFormModal={setShowColorPaletteNameFormModal}/>
            </div>
        </div>
      }
    </>
  )
}
