import { useContext, useEffect } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";
import ColorPaletteItem from "../ColorPaletteItem";

export default function AdminViewColorPalette() {

  const { colorPaletteDetails, adminFetchColorPalette} = useContext(ColorPaletteDetailsContext);
  
  useEffect(() => {
    if (localStorage.getItem("adminSignedIn")){
      adminFetchColorPalette();
    }
  }, []);
  
  return (
    <>
      {
        colorPaletteDetails.length === 0 ?
          <></>
        :
          <div>
            {(colorPaletteDetails).map((colorpalette)=>{
                  return <ColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors}/>
              })}
          </div>
      }
    </>
  )
}
