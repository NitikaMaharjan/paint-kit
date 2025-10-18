import { useContext, useEffect } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";
import AdminColorPaletteItem from "./AdminColorPaletteItem";

export default function AdminViewColorPalette() {

  const { adminColorPaletteDetails, adminFetchColorPalette } = useContext(ColorPaletteDetailsContext);
  
  useEffect(() => {
    if (localStorage.getItem("adminSignedIn")){
      adminFetchColorPalette();
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      {
        adminColorPaletteDetails.length === 0 ?
          <></>
        :
          <div>
            {(adminColorPaletteDetails).map((colorpalette)=>{
                  return <AdminColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors}/>
              })}
          </div>
      }
    </>
  )
}
