import { useContext, useEffect, useState } from "react";
import ColorPaletteContext from "../../context/colorpalette/ColorPaletteContext";
import AdminColorPaletteItem from "./AdminColorPaletteItem";
import EditColorPaletteForm from "./EditColorPaletteForm";

export default function AdminViewColorPalette() {

  const { adminColorPalettes, fetchAdminColorPalette } = useContext(ColorPaletteContext);
  
  const [showEditColorPaletteFormModal, setShowEditColorPaletteFormModal] = useState(false);
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    color_palette_id: "",
    color_palette_name: "",
    colors: ""
  });
  
  useEffect(() => {
    if(localStorage.getItem("adminSignedIn")){
      fetchAdminColorPalette();
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      {
        adminColorPalettes.length !== 0 ?
          <div>
            {adminColorPalettes.map((colorpalette)=>{
                  return <AdminColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal} setSelectedColorPalette={setSelectedColorPalette}/>
              }).reverse()}
          </div>
        :
          <div>
            no color palettes
          </div>
      }

      {
        showEditColorPaletteFormModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowEditColorPaletteFormModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <EditColorPaletteForm selectedColorPalette={selectedColorPalette} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal}/>
            </div>
        </div>
      }
    </>
  );
}
