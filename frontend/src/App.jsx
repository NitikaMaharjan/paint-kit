import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProgressBarState from "./context/progressbar/ProgressBarState";
import AlertState from "./context/alert/AlertState";
import ConfirmState from "./context/confirm/ConfirmState";
import SignedInAdminDetailsState from "./context/admin/SignedInAdminDetailsState";
import SignedInUserDetailsState from "./context/user/SignedInUserDetailsState";
import TemplateState from "./context/template/TemplateState";
import DrawState from "./context/draw/DrawState";
import ColorPaletteDetailsState from "./context/colorpalette/ColorPaletteDetailsState";
import Home from "./components/Home";
import UserHome from "./components/user/UserHome";
import UserSignin from "./components/user/UserSignin";
import UserSignup from "./components/user/UserSignup";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminSignin from "./components/admin/AdminSignin";
import AdminSignup from "./components/admin/AdminSignup";
import UserViewDrawing from "./components/draw/UserViewDrawing";
import UserEditDrawing from "./components/draw/UserEditDrawing";
import ViewTemplate from "./components/template/ViewTemplate";
import UseTemplate from "./components/draw/UseTemplate";

function App() {
  return (
    <ProgressBarState>
      <AlertState>
        <ConfirmState>
          <SignedInAdminDetailsState>
            <SignedInUserDetailsState>
              <TemplateState>
                <DrawState>
                  <ColorPaletteDetailsState>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/userhome" element={<UserHome/>}/>
                        <Route path="/usersignin" element={<UserSignin/>}/>
                        <Route path="/usersignup" element={<UserSignup/>}/>
                        <Route path="/admindashboard" element={<AdminDashboard/>}/>
                        <Route path="/adminsignin" element={<AdminSignin/>}/>
                        <Route path="/adminsignup" element={<AdminSignup/>}/>
                        <Route path="/userviewdrawing" element={<UserViewDrawing/>}/>
                        <Route path="/usereditdrawing/:drawingid" element={<UserEditDrawing/>}/>
                        <Route path="/viewtemplate" element={<ViewTemplate/>}/>
                        <Route path="/usetemplate/:templateid" element={<UseTemplate/>}/>
                      </Routes>
                    </BrowserRouter>
                  </ColorPaletteDetailsState>
                </DrawState>
              </TemplateState>
            </SignedInUserDetailsState>
          </SignedInAdminDetailsState>
        </ConfirmState>
      </AlertState>
    </ProgressBarState>
  )
}

export default App
