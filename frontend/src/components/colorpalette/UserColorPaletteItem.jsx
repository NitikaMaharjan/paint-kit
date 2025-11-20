import { useContext } from "react";
import ColorPaletteContext from "../../context/colorpalette/ColorPaletteContext";

export default function UserColorPaletteItem(props) {

    const { color_palette_id, color_palette_name, colors, palette_updated_date, setShowEditColorPaletteFormModal, setSelectedColorPalette, setColorPaletteInUse } = props;

    const { handleDeleteColorPalette } = useContext(ColorPaletteContext);

    return (
        <div style={{margin: "0px 0px 18px 0px", width: "min-content"}}>
            <div className="flex items-center justify-between mb-1" style={{padding: "12px 0px"}}>
                <p title={color_palette_name} style={{fontSize: "13px"}}>{color_palette_name.length>10?color_palette_name.slice(0,10)+"...":color_palette_name}</p>
                <div className="flex items-center">
                    <button className="icon-btn" onClick={()=>{setSelectedColorPalette({color_palette_id: color_palette_id, color_palette_name: color_palette_name, colors: colors}); setShowEditColorPaletteFormModal(true);}}><img src="/edit.png" style={{height: "20px", width: "20px"}}/></button>
                    <button className="icon-btn" onClick={()=>{handleDeleteColorPalette(color_palette_id)}}><img src="/delete.png" style={{height: "18px", width: "18px"}}/></button>
                    <button className="action-btn" onClick={()=>{setColorPaletteInUse({ color_palette_name: color_palette_name, colors: colors })}}>Use</button>
                </div>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px"}}>
                {colors.map((a_color, index)=>{
                    return <div key={index} title={a_color} style={{height: "36px", width: "36px", backgroundColor: `${a_color}`}}></div>
                }).reverse()}
            </div>
        </div>
    );
}
