import { useContext, useEffect, useState } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";
import AdminColorPaletteItem from "./AdminColorPaletteItem";
import UserColorPaletteItem from "./UserColorPaletteItem";
import UserEditColorPalette from "./UserEditColorPalette";

export default function UserViewColorPalette() {

  const { adminColorPaletteDetails, adminFetchColorPalette, userColorPaletteDetails, userFetchUserColorPalette } = useContext(ColorPaletteDetailsContext);

  const [showColorPalette, setShowColorPalette] = useState("community");
  const [showEditColorPaletteModal, setShowEditColorPaletteModal] = useState(false);
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    color_palette_id: "",
    color_palette_name: "",
    colors: ""
  });
  
  useEffect(() => {
    if (localStorage.getItem("userSignedIn")){
      adminFetchColorPalette();
      userFetchUserColorPalette();
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
          showColorPalette === "community"?
            adminColorPaletteDetails.length === 0 ?
            <div>
                <p>nothing to show</p>
              </div>
            :
              <div>
                {(adminColorPaletteDetails).map((colorpalette)=>{
                  return <AdminColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors}/>
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
                  return <UserColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setShowEditColorPaletteModal={setShowEditColorPaletteModal} setSelectedColorPalette={setSelectedColorPalette}/>
                  }).reverse()}
              </div>
        }
      </div>
      {
        showEditColorPaletteModal
        &&
        <div className="confirm-modal-background">
            <div className="flex items-center pt-8 gap-10">
                <div style={{position: "fixed", top: "32px", right: "320px", height: "24px", width: "24px", cursor: "pointer"}} onClick={()=>{setShowEditColorPaletteModal(false)}}>
                    <img src="/close-white.png" style={{height: "18px", width: "18px"}}/>
                </div>
                <UserEditColorPalette selectedColorPalette={selectedColorPalette} setShowEditColorPaletteModal={setShowEditColorPaletteModal}/>
            </div>
        </div>
      }
    </>
  )
}
