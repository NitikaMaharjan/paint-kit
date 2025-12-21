import { useContext, useEffect, useState } from "react";
import ColorPaletteContext from "../../context/colorpalette/ColorPaletteContext";
import AdminColorPaletteItem from "./AdminColorPaletteItem";
import UserColorPaletteItem from "./UserColorPaletteItem";
import EditColorPaletteForm from "./EditColorPaletteForm";
import UserSignin from "../user/UserSignin";

export default function UserViewColorPalette(props) {

  const { adminColorPalettes, fetchAdminColorPalette, userColorPalettes, fetchUserColorPalette } = useContext(ColorPaletteContext);

  const [showColorPalette, setShowColorPalette] = useState("community");
  const [showEditColorPaletteFormModal, setShowEditColorPaletteFormModal] = useState(false);
  const [showUserSigninFormModal, setShowUserSigninFormModal] = useState(false);
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    color_palette_id: "",
    color_palette_name: "",
    colors: ""
  });
  const [searchAdminKeyword, setSearchAdminKeyword] = useState("");
  const [filteredAdminColorPalettes, setFilteredAdminColorPalettes] = useState([]);
  const [searchUserKeyword, setSearchUserKeyword] = useState("");
  const [filteredUserColorPalettes, setFilteredUserColorPalettes] = useState([]);

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
        setFilteredAdminColorPalettes(adminColorPalettes.filter((colorpalette)=>{return colorpalette.color_palette_name.toLowerCase().includes(searchAdminKeyword.toLowerCase())}));
      }
    }
  }
  
  const handleSearchUserKeywordChange = (e) => {
    setSearchUserKeyword(e.target.value); 
    if(searchUserKeyword.trim()!==""){
      setFilteredUserColorPalettes(userColorPalettes.filter((colorpalette)=>{return colorpalette.color_palette_name.toLowerCase().includes(searchUserKeyword.toLowerCase())}));
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
  
  useEffect(() => {
    fetchAdminColorPalette();
    if(localStorage.getItem("userSignedIn") && localStorage.getItem("user_token")){
      fetchUserColorPalette();
    }
  }, []);
  
  return (
    <>
      <div className="color-palette">
        <div className="flex justify-between">
          <div className={`${showColorPalette==="community"?"active":""}`}>
            <button className="color-palette-btn" onClick={()=>{setShowColorPalette("community")}}>Community Palettes</button>
          </div>
          <div className={`${showColorPalette==="my"?"active":""}`}>
            <button className="color-palette-btn" onClick={()=>{if(checkUserSignedIn()){setShowColorPalette("my")}}}>My Palettes</button>
          </div>
        </div>
        {
          showColorPalette === "community" ?
            adminColorPalettes.length !== 0 ?
              <>
                <div className="flex justify-center mb-4">
                  <form className="auth-form" style={{margin: "0px"}}>
                    <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                      <img src="/search.png" alt="search icon"/>
                      <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter color palette name" value={searchAdminKeyword} onChange={handleSearchAdminKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{color: "rgba(0, 0, 0, 0.8)"}}/>
                      <img src="/close.png" alt="close icon" onClick={()=>{clearInput("admin")}} style={{opacity: `${searchAdminKeyword===""?0:1}`}}/>
                    </div>
                  </form>
                </div>
                {(searchAdminKeyword===""?adminColorPalettes:filteredAdminColorPalettes).map((colorpalette)=>{
                  return <AdminColorPaletteItem key={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} palette_updated_date={colorpalette.palette_updated_date} setColorPaletteInUse={props.setColorPaletteInUse} fromHome={props.fromHome}/>
                }).reverse()}
              </>
            :
              <div>
                no color palettes
              </div>
          :
            userColorPalettes.length !== 0 ?
              <>
                <div className="flex justify-center mb-4">
                  <form className="auth-form" style={{margin: "0px"}}>
                    <div className="input-bar" id="search-keyword-input-bar" style={{height: "28px", backgroundColor: "white", gap: "8px"}}>
                      <img src="/search.png" alt="search icon"/>
                      <input type="text" id="search_keyword" name="search_keyword" placeholder="Enter color palette name" value={searchUserKeyword} onChange={handleSearchUserKeywordChange} autoComplete="on" onFocus={()=>{addBorderHighlight("search-keyword")}} onBlur={()=>{removeBorderHighlight("search-keyword")}} style={{color: "rgba(0, 0, 0, 0.8)"}}/>
                      <img src="/close.png" alt="close icon" onClick={()=>{clearInput("user")}} style={{opacity: `${searchUserKeyword===""?0:1}`}}/>
                    </div>
                  </form>
                </div>
                {(searchUserKeyword===""?userColorPalettes:filteredUserColorPalettes).map((colorpalette)=>{
                  return <UserColorPaletteItem key={colorpalette._id} color_palette_id={colorpalette._id} color_palette_name={colorpalette.color_palette_name} colors={colorpalette.colors} setShowEditColorPaletteFormModal={setShowEditColorPaletteFormModal} setSelectedColorPalette={setSelectedColorPalette} setColorPaletteInUse={props.setColorPaletteInUse}/>
                }).reverse()}
              </>
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