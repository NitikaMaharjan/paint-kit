import { useContext, useEffect } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";
import ColorPaletteItem from "../colorpalette/ColorPaletteItem";

export default function UserViewColorPalette() {

  const { adminColorPaletteDetails, adminFetchColorPalette, userColorPaletteDetails, userFetchUserColorPalette } = useContext(ColorPaletteDetailsContext);
  
  useEffect(() => {
    if (localStorage.getItem("userSignedIn")){
      adminFetchColorPalette();
      userFetchUserColorPalette();
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
      {
        userColorPaletteDetails.length === 0 ?
          <></>
        :
          <div>
            {(userColorPaletteDetails).map((colorpalette)=>{
                  return <ColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors}/>
              })}
          </div>
      }
    </>
  )
}
