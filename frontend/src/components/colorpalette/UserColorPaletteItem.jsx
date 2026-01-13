import { useContext } from "react";
import ColorPaletteContext from "../../context/colorpalette/ColorPaletteContext";

export default function UserColorPaletteItem(props) {

    const { color_palette_id, color_palette_name, colors, palette_updated_date, setShowEditColorPaletteFormModal, setSelectedColorPalette, setColorPaletteInUse } = props;

    const { handleDeleteColorPalette } = useContext(ColorPaletteContext);

    const handleCapitalizeEachFirstLetter = (text) => {
        let words = text.split(" ");
        for(let i=0; i<words.length; i++){
        words[i] = words[i].charAt(0).toUpperCase()+words[i].substring(1).toLowerCase();
        }
        text = (words.join(" "));
        return text;
    }

    const formatDate = (date) => {
        let date_object = new Date(date);
        return date_object.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    }
  
    const formatTime = (date) => {
        let date_object = new Date(date);
        return date_object.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    return (
        <div className="color-palette-item" style={{height: "min-content", border: "1px solid rgba(0, 0, 0, 0.3)", padding: "6px"}} title={formatDate(palette_updated_date)+" "+formatTime(palette_updated_date)}>
            <div className="flex items-center justify-between mb-3">
                <h1 style={{fontSize: "12px"}} title={color_palette_name}>{handleCapitalizeEachFirstLetter(color_palette_name.length>9?color_palette_name.slice(0,9)+"...":color_palette_name)}</h1>
                <div className="flex items-center">
                    <button className="edit-delete-button" onClick={()=>{setSelectedColorPalette({color_palette_id: color_palette_id, color_palette_name: color_palette_name, colors: colors}); setShowEditColorPaletteFormModal(true);}}><img src="/edit.png" alt="edit icon" style={{height: "20px", width: "20px"}}/></button>
                    <button className="edit-delete-button" onClick={()=>{handleDeleteColorPalette(color_palette_id)}}><img src="/delete.png" alt="delete icon" style={{height: "18px", width: "18px"}}/></button>
                    <button className="action-button" onClick={()=>{setColorPaletteInUse({ color_palette_name: color_palette_name, colors: colors })}}>Use</button>
                </div>
            </div>
            <div style={{height: "66px"}}>
                <div style={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "2px"}}>
                    {
                        colors.map((a_color, index)=>{
                            return <div key={index} title={a_color} style={{height: "32px", width: "32px", backgroundColor: `${a_color}`}}></div>
                        }).reverse()
                    }
                    {
                        Array.from({length: 12 - colors.length}).map((key, index)=>{
                            return <div key={index} style={{height: "32px", width: "32px", backgroundColor: "white", border: "1px solid rgba(0, 0, 0, 0.3)"}}></div>
                        })
                    }
                </div>
            </div>
        </div>
    );
}