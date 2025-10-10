import { useContext, useEffect, useState } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";
import ColorPaletteItem from "./ColorPaletteItem";

export default function UserViewColorPalette() {

  const { adminColorPaletteDetails, adminFetchColorPalette, userColorPaletteDetails, userFetchUserColorPalette } = useContext(ColorPaletteDetailsContext);

  const [showColorPalette, setShowColorPalette] = useState("community");
  
  useEffect(() => {
    if (localStorage.getItem("userSignedIn")){
      adminFetchColorPalette();
      userFetchUserColorPalette();
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <div className="color-palette">
      <div className="flex justify-between">
        <div className={`${showColorPalette==="community"?"active":""}`}>
          <button className="color-palette-btn" onClick={()=>{setShowColorPalette("community")}}>Community Palettes</button>
        </div>
        <div className={`${showColorPalette==="my"?"active":""}`}>
          <button className="color-palette-btn" onClick={()=>{setShowColorPalette("my")}}>My Palettes</button>
        </div>
      </div>
      {
        showColorPalette === "community"?
          adminColorPaletteDetails.length === 0 ?
            <div>
              <p>nothing to show</p>
            </div>
          :
            <div>
              {(adminColorPaletteDetails).map((colorpalette)=>{
                    return <ColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors}/>
                }).reverse()}
            </div>
        :
          userColorPaletteDetails.length === 0 ?
            <div>
              <p>get started with your own custom palettes</p>
            </div>
          :
            <div>
              {(userColorPaletteDetails).map((colorpalette)=>{
                    return <ColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors}/>
                }).reverse()}
            </div>
      }
    </div>
  )
}
