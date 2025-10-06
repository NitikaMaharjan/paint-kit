import { useContext, useEffect, useState } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";
import ColorPaletteItem from "../colorpalette/ColorPaletteItem";

export default function UserViewColorPalette() {

  const { adminColorPaletteDetails, adminFetchColorPalette, userColorPaletteDetails, userFetchUserColorPalette } = useContext(ColorPaletteDetailsContext);

  const [showColorPalette, setShowColorPalette] = useState("community palettes");
  
  useEffect(() => {
    if (localStorage.getItem("userSignedIn")){
      adminFetchColorPalette();
      userFetchUserColorPalette();
    }
  }, []);
  
  return (
    <div className="color-palette">
      <div className="flex justify-between">
        <button className="add-color-btn" onClick={()=>{setShowColorPalette("community palettes")}}>Community</button>
        <button className="add-color-btn" onClick={()=>{setShowColorPalette("my palettes")}}>Mine</button>
      </div>
      {
        showColorPalette === "community palettes"?
          adminColorPaletteDetails.length === 0 ?
            <div>
              <p>nothing to show</p>
            </div>
          :
            <div>
              {(adminColorPaletteDetails).map((colorpalette)=>{
                    return <ColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors}/>
                })}
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
                })}
            </div>
      }
    </div>
  )
}
