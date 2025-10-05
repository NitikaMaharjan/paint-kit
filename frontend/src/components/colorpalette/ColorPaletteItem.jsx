export default function ColorPaletteItem(props) {
    const { color_palette_name, colors } = props;
    return (
        <div>
            <p>{color_palette_name}</p>
            {colors.map((a_color, index)=>{return <div key={index} style={{height: "24px", width: "24px", backgroundColor: `${a_color}`}}></div>})}
        </div>
    )
}
