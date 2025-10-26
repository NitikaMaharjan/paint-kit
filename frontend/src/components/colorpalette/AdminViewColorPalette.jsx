import { useContext, useEffect, useState } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";
import AdminColorPaletteItem from "./AdminColorPaletteItem";
import EditColorPalette from "./EditColorPalette";

export default function AdminViewColorPalette() {

  const { adminColorPaletteDetails, adminFetchColorPalette } = useContext(ColorPaletteDetailsContext);
  
  const [showEditColorPaletteModal, setShowEditColorPaletteModal] = useState(false);
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    color_palette_id: "",
    color_palette_name: "",
    colors: ""
  });
  
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
          <div>
            no color palettes
          </div>
        :
          <div>
            {(adminColorPaletteDetails).map((colorpalette)=>{
                  return <AdminColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setShowEditColorPaletteModal={setShowEditColorPaletteModal} setSelectedColorPalette={setSelectedColorPalette}/>
              }).reverse()}
          </div>
      }
      {
        showEditColorPaletteModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowEditColorPaletteModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <EditColorPalette selectedColorPalette={selectedColorPalette} setShowEditColorPaletteModal={setShowEditColorPaletteModal}/>
            </div>
        </div>
      }
    </>
  )
}
