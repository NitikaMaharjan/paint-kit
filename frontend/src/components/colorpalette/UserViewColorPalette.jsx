import { useContext, useEffect, useState, useRef } from "react";
import ColorPaletteContext from "../../context/colorpalette/ColorPaletteContext";
import AdminColorPaletteItem from "./AdminColorPaletteItem";
import UserColorPaletteItem from "./UserColorPaletteItem";
import EditColorPaletteForm from "./EditColorPaletteForm";
import UserSignin from "../user/UserSignin";

export default function UserViewColorPalette(props) {

  const communityScrollRef = useRef(null);
  const myScrollRef = useRef(null);

  const { adminColorPalettes, fetchAdminColorPalette, userColorPalettes, fetchUserColorPalette } = useContext(ColorPaletteContext);

  const [showColorPalette, setShowColorPalette] = useState("community");
  const [searchAdminKeyword, setSearchAdminKeyword] = useState("");
  const [searchUserKeyword, setSearchUserKeyword] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("latest");
  const [filteredAdminColorPalettes, setFilteredAdminColorPalettes] = useState([]);
  const [filteredUserColorPalettes, setFilteredUserColorPalettes] = useState([]);
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    color_palette_id: "",
    color_palette_name: "",
    colors: ""
  });
  const [showEditColorPaletteFormModal, setShowEditColorPaletteFormModal] = useState(false);
  const [communityYScroll, setCommunityYScroll] = useState(false);
  const [myYScroll, setMyYScroll] = useState(false);
  const [showUserSigninFormModal, setShowUserSigninFormModal] = useState(false);

  const checkUserSignedIn = () => {
    if(localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")){
      return true;
    }else{
      setShowUserSigninFormModal(true);
      return false;
    }
  }

  const handleSearchAdminKeywordChange = (e) => {
    if(checkUserSignedIn()){
      setSearchAdminKeyword(e.target.value); 
      if(searchAdminKeyword.trim()!==""){
        setFilteredAdminColorPalettes(adminColorPalettes.filter((colorpalette)=>{return colorpalette.color_palette_name.toLowerCase().includes(searchAdminKeyword.toLowerCase()) || colorpalette.colors.some( color => color.toLowerCase().includes(searchAdminKeyword.toLowerCase()))}));
      }
    }
  }
  
  const handleSearchUserKeywordChange = (e) => {
    setSearchUserKeyword(e.target.value); 
    if(searchUserKeyword.trim()!==""){
      setFilteredUserColorPalettes(userColorPalettes.filter((colorpalette)=>{return colorpalette.color_palette_name.toLowerCase().includes(searchUserKeyword.toLowerCase()) || colorpalette.colors.some( color => color.toLowerCase().includes(searchUserKeyword.toLowerCase()))}));
    }
  }

  const clearInput = (type) => {
    if(type==="admin"){
      setSearchAdminKeyword("");
    }else if(type==="user"){
      setSearchUserKeyword("");
    }
  }

  const addBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.8)";
  }
  
  const removeBorderHighlight = (type) => {
    document.getElementById(type+"-input-bar").style.borderColor = "rgba(0, 0, 0, 0.3)";
  }
  
  const communityScrollToTop = () => {
    communityScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }
  
  const myScrollToTop = () => {
    myScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    fetchAdminColorPalette();
    if(localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")){
      fetchUserColorPalette();
    }
    // eslint-disable-next-line
  }, []);
  
  return (
    <>
      <div className="w-full">

        <div className="flex">
          <div className={`${showColorPalette==="community"?"color-palette-button-div-active":""}`}>
            <button className="color-palette-button" onClick={()=>{setShowColorPalette("community")}}>Community Palettes</button>
          </div>
          <div className={`${showColorPalette==="my"?"color-palette-button-div-active":""} flex justify-center`} style={{width: "126px"}}>
            <button className="color-palette-button" onClick={()=>{if(checkUserSignedIn()){setShowColorPalette("my")}}}>My Palettes</button>
          </div>
        </div>

        {
          showColorPalette === "community" ?
            adminColorPalettes.length !== 0 ?
              <>
                <div className="flex justify-center mt-4 mb-2">
                  <form className="auth-form" style={{margin: "0px"}}>
                    <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                      <img src="/search.png" alt="search icon"/>
                      <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter color palette/color name" value={searchAdminKeyword} onChange={handleSearchAdminKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{width: "202px", fontSize: "11px"}}/>
                      <img src="/close.png" alt="close icon" onClick={()=>{clearInput("admin")}} style={{opacity: `${searchAdminKeyword===""?"0":"1"}`}}/>
                    </div>
                  </form>
                </div>

                <div className="flex justify-center mb-4" style={{gap: "6px"}}>
                  <button className={`chip ${(selectedOrder==="latest" || selectedOrder==="oldest") && searchAdminKeyword===""?"chip-active":""}`} onClick={()=>{if(checkUserSignedIn()){setSearchAdminKeyword("")}}} style={{fontSize: "11px"}}>All</button>
                  <button className={`chip ${selectedOrder==="latest"?"chip-active":""}`} onClick={()=>{if(checkUserSignedIn()){setSelectedOrder("latest")}}} style={{fontSize: "11px"}}>Latest</button>
                  <button className={`chip ${selectedOrder==="oldest"?"chip-active":""}`} onClick={()=>{if(checkUserSignedIn()){setSelectedOrder("oldest")}}} style={{fontSize: "11px"}}>Oldest</button>
                </div>

                <div ref={communityScrollRef} className="flex flex-col items-center gap-3" style={{height: "180px", overflowY: "auto", scrollbarGutter: "stable"}} onScroll={()=>setCommunityYScroll(communityScrollRef.current.scrollTop > 0)}>
                  {
                    selectedOrder ==="latest" ?
                      (searchAdminKeyword===""?adminColorPalettes:filteredAdminColorPalettes).map((colorpalette)=>{
                        return <AdminColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} palette_updated_date={colorpalette.palette_updated_date} setColorPaletteInUse={props.setColorPaletteInUse} fromHome={props.fromHome}/>
                      }).reverse()
                    :
                      (searchAdminKeyword===""?adminColorPalettes:filteredAdminColorPalettes).map((colorpalette)=>{
                        return <AdminColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} palette_updated_date={colorpalette.palette_updated_date} setColorPaletteInUse={props.setColorPaletteInUse} fromHome={props.fromHome}/>
                      })
                  }
                  <button className={`up-scroll-button${communityYScroll?"-show":""}`} onClick={communityScrollToTop} style={{bottom: "22px", right: "34px"}}><img src="/up-arrow.png" alt="up arrow icon" style={{height: "14px", width: "14px"}}/></button>
                </div>
              </>
            :
              <div className="flex items-center justify-center" style={{height: "280px"}}>
                <p style={{fontSize: "12px"}}><b>No community palettes yet!</b></p>
              </div>
          :
            userColorPalettes.length !== 0 ?
              <>
                <div className="flex justify-center mt-4 mb-2">
                  <form className="auth-form" style={{margin: "0px"}}>
                    <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                      <img src="/search.png" alt="search icon"/>
                      <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter color palette/color name" value={searchUserKeyword} onChange={handleSearchUserKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{width: "202px", fontSize: "11px"}}/>
                      <img src="/close.png" alt="close icon" onClick={()=>{clearInput("user")}} style={{opacity: `${searchUserKeyword===""?"0":"1"}`}}/>
                    </div>
                  </form>
                </div>

                <div className="flex justify-center mb-4" style={{gap: "6px"}}>
                  <button className={`chip ${(selectedOrder==="latest" || selectedOrder==="oldest") && searchUserKeyword===""?"chip-active":""}`} onClick={()=>{setSearchUserKeyword("")}} style={{fontSize: "11px"}}>All</button>
                  <button className={`chip ${selectedOrder==="latest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("latest")}} style={{fontSize: "11px"}}>Latest</button>
                  <button className={`chip ${selectedOrder==="oldest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("oldest")}} style={{fontSize: "11px"}}>Oldest</button>
                </div>

                <div ref={myScrollRef} className="flex flex-col items-center gap-3" style={{height: "180px", overflowY: "auto", scrollbarGutter: "stable"}} onScroll={()=>{setMyYScroll(myScrollRef.current.scrollTop > 0)}}>
                  {
                    selectedOrder ==="latest" ?
                      (searchUserKeyword===""?userColorPalettes:filteredUserColorPalettes).map((colorpalette)=>{
                        return <UserColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} palette_updated_date={colorpalette.palette_updated_date} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal} setSelectedColorPalette={setSelectedColorPalette} setColorPaletteInUse={props.setColorPaletteInUse}/>
                      }).reverse()
                    :
                      (searchUserKeyword===""?userColorPalettes:filteredUserColorPalettes).map((colorpalette)=>{
                        return <UserColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} palette_updated_date={colorpalette.palette_updated_date} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal} setSelectedColorPalette={setSelectedColorPalette} setColorPaletteInUse={props.setColorPaletteInUse}/>
                      })
                  }
                  <button className={`up-scroll-button${myYScroll?"-show":""}`} onClick={myScrollToTop} style={{bottom: "22px", right: "34px"}}><img src="/up-arrow.png" alt="up arrow icon" style={{height: "14px", width: "14px"}}/></button>
                </div>
              </>
            :
              <div className="flex items-center justify-center" style={{height: "280px"}}>
                <p style={{fontSize: "12px"}}><b>Add color palettes to get started!</b></p>
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

      {
        showUserSigninFormModal
        &&
        <div className="confirm-modal-background">
          <UserSignin popup={true} setShowUserSigninFormModal={setShowUserSigninFormModal}/>
        </div>
      }
    </>
  );
}