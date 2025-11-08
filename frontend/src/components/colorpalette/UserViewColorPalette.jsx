import { useContext, useEffect, useState } from "react";
import ColorPaletteContext from "../../context/colorpalette/ColorPaletteContext";
import AdminColorPaletteItem from "./AdminColorPaletteItem";
import UserColorPaletteItem from "./UserColorPaletteItem";
import EditColorPaletteForm from "./EditColorPaletteForm";

export default function UserViewColorPalette(props) {

  const { adminColorPalettes, fetchAdminColorPalette, userColorPalettes, fetchUserColorPalette } = useContext(ColorPaletteContext);

  const [showColorPalette, setShowColorPalette] = useState("community");
  const [showEditColorPaletteFormModal, setShowEditColorPaletteFormModal] = useState(false);
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    color_palette_id: "",
    color_palette_name: "",
    colors: ""
  });
  
  useEffect(() => {
    if (localStorage.getItem("userSignedIn")){
      fetchAdminColorPalette();
      fetchUserColorPalette();
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
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
          showColorPalette === "community" ?
            adminColorPalettes.length !== 0 ?
              <div>
                {(adminColorPalettes).map((colorpalette)=>{
                  return <AdminColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setColorPaletteInUse={props.setColorPaletteInUse}/>
                }).reverse()}
              </div>
            :
              <div>
                no color palettes
              </div>
          :
            userColorPalettes.length !== 0 ?
              <div>
                {(userColorPalettes).map((colorpalette)=>{
                  return <UserColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal} setSelectedColorPalette={setSelectedColorPalette} setColorPaletteInUse={props.setColorPaletteInUse}/>
                }).reverse()}
              </div>
            :
              <div>
                no color palettes
              </div>
        }
      </div>
      
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
