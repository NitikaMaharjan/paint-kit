import { useContext } from "react";
import ColorPaletteDetailsContext from "../../context/colorpalette/ColorPaletteDetailsContext";

export default function AdminColorPaletteItem(props) {

    const { color_palette_id, color_palette_name, colors, setShowEditColorPaletteModal, setSelectedColorPalette } = props;

    const { handleDeleteColorPalette } = useContext(ColorPaletteDetailsContext);

    return (
        <>
            {localStorage.getItem("adminSignedIn") && localStorage.getItem("admin_token")?
                <div className="color-palette-item">
                    <button className="confirm-btn" onClick={()=>{setSelectedColorPalette({color_palette_id: color_palette_id, color_palette_name: color_palette_name, colors: colors}); setShowEditColorPaletteModal(true);}}>Edit</button>
                    <button className="confirm-btn" onClick={()=>{handleDeleteColorPalette(color_palette_id)}}>Delete</button>
                    <div style={{padding: "12px 12px 4px 12px"}}>
                        <p title={color_palette_name}style={{fontSize: "13px"}}>{color_palette_name.slice(0,14)+"..."}</p>
                    </div>
                    <div style={{padding: "0px 12px 12px 12px"}}>
                        <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "2px"}}>
                            {colors.map((a_color, index)=>{return <div key={index} title={a_color} style={{height: "32px", width: "32px", backgroundColor: `${a_color}`}}></div>}).reverse()}
                        </div>
                    </div>
                </div>
                :
                <div className="color-palette-item">
                    <div style={{padding: "12px 12px 4px 12px"}}>
                        <p title={color_palette_name}style={{fontSize: "13px"}}>{color_palette_name.slice(0,14)+"..."}</p>
                    </div>
                    <div style={{padding: "0px 12px 12px 12px"}}>
                        <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "2px"}}>
                            {colors.map((a_color, index)=>{return <div key={index} title={a_color} style={{height: "32px", width: "32px", backgroundColor: `${a_color}`}}></div>}).reverse()}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
