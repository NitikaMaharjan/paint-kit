import { useContext, useEffect } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";
import ColorPaletteItem from "./ColorPaletteItem";

export default function AdminViewColorPalette() {

  const { adminColorPaletteDetails, adminFetchColorPalette } = useContext(ColorPaletteDetailsContext);
  
  useEffect(() => {
    if (localStorage.getItem("adminSignedIn")){
      adminFetchColorPalette();
    }
  }, []);
  
  return (
    <>
      {
        adminColorPaletteDetails.length === 0 ?
          <></>
        :
          <div>
            {(adminColorPaletteDetails).map((colorpalette)=>{
                  return <ColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors}/>
              })}
          </div>
      }
    </>
  )
}
