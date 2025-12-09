import { useContext, useEffect, useState, useRef } from "react";
import ColorPaletteContext from "../../context/colorpalette/ColorPaletteContext";
import AdminColorPaletteItem from "./AdminColorPaletteItem";
import EditColorPaletteForm from "./EditColorPaletteForm";

export default function AdminViewColorPalette() {

  const colorPaletteScrollRef = useRef(null);

  const { adminColorPalettes, fetchAdminColorPalette } = useContext(ColorPaletteContext);
  
  const [showEditColorPaletteFormModal, setShowEditColorPaletteFormModal] = useState(false);
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    color_palette_id: "",
    color_palette_name: "",
    colors: ""
  });
  const [searchAdminKeyword, setSearchAdminKeyword] = useState("");
  const [filteredAdminColorPalettes, setFilteredAdminColorPalettes] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("latest");
  const [colorPaletteYScroll, setColorPaletteYScroll] = useState(false);

  const handleSearchAdminKeywordChange = (e) => {
    setSearchAdminKeyword(e.target.value); 
    if(searchAdminKeyword.trim()!==""){
      setFilteredAdminColorPalettes(adminColorPalettes.filter((colorpalette)=>{return colorpalette.color_palette_name.toLowerCase().includes(searchAdminKeyword.toLowerCase())}));
    }
  }

  const clearInput = () => {
    setSearchAdminKeyword("");
  }

  const addBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }

  const colorPaletteScrollToTop = () => {
    colorPaletteScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  useEffect(() => {
    fetchAdminColorPalette();
  }, [adminColorPalettes]);
  
  return (
    <>
      {
        adminColorPalettes.length !== 0 ?
          <>
            <div className="flex justify-center mb-2">
              <form className="auth-form" style={{margin: "0px"}}>
                <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                  <img src="/search.png" alt="search icon"/>
                  <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter color palette name" value={searchAdminKeyword} onChange={handleSearchAdminKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{color: "rgba(0, 0, 0, 0.8)"}}/>
                  <img src="/close.png" alt="close icon" onClick={()=>{clearInput()}} style={{opacity: `${searchAdminKeyword===""?0:1}`}}/>
                </div>
              </form>
            </div>

            <div className="flex justify-center mb-4" style={{gap: "6px"}}>
              <button className={`chip ${(selectedOrder==="latest" || selectedOrder==="oldest") && searchAdminKeyword===""?"chip-active":""}`} onClick={()=>{setSearchAdminKeyword("")}}>All</button>
              <button className={`chip ${selectedOrder==="latest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("latest");}}>Latest</button>
              <button className={`chip ${selectedOrder==="oldest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("oldest");}}>Oldest</button>
            </div>

            <div ref={colorPaletteScrollRef} style={{height: "430px", overflowY: "auto", scrollbarGutter: "stable", paddingRight: "10px"}} onScroll={() => setColorPaletteYScroll(colorPaletteScrollRef.current.scrollTop > 0)}>
              <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px"}}>
                { 
                  selectedOrder ==="latest" ?
                    (searchAdminKeyword===""?adminColorPalettes:filteredAdminColorPalettes).map((colorpalette)=>{
                      return <AdminColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal} setSelectedColorPalette={setSelectedColorPalette}/>
                    }).reverse()
                  :
                    (searchAdminKeyword===""?adminColorPalettes:filteredAdminColorPalettes).map((colorpalette)=>{
                      return <AdminColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal} setSelectedColorPalette={setSelectedColorPalette}/>
                    })
                }
              </div>
              <button className={`up-scroll-btn${colorPaletteYScroll?"-show":""}`} onClick={colorPaletteScrollToTop}><img src="/up-arrow.png" alt="up arrow icon" style={{height: "14px", width: "14px"}}/></button>
            </div>
          </>
        :
          <div className="flex justify-center items-center" style={{height: "508px"}}>
              <p style={{fontSize: "14px"}}><b>Add color palettes to get started!</b></p>
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