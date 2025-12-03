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
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px"}}>
              {adminColorPalettes.map((colorpalette)=>{
                return <AdminColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal} setSelectedColorPalette={setSelectedColorPalette}/>
              }).reverse()}
            </div>
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
          <EditColorPaletteForm selectedColorPalette={selectedColorPalette} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal}/>
        </div>
      }
    </>
  );
}