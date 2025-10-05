import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProgressBarState from './context/progressbar/ProgressBarState';
import AlertState from './context/alert/AlertState';
import ConfirmState from './context/confirm/ConfirmState';
import SignedInAdminDetailsState from './context/admin/SignedInAdminDetailsState';
import SignedInUserDetailsState from './context/user/SignedInUserDetailsState';
import Home from './components/Home';
import UserHome from './components/user/UserHome';
import UserSignin from './components/user/UserSignin';
import UserSignup from './components/user/UserSignup';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSignin from './components/admin/AdminSignin';
import AdminSignup from './components/admin/AdminSignup';
import CreateColorPalette from './components/CreateColorPalette';

function App() {
  return (
    <ProgressBarState>
      <AlertState>
        <ConfirmState>
          <SignedInAdminDetailsState>
            <SignedInUserDetailsState>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<Home/>}/>
                  <Route path='/userhome' element={<UserHome/>}/>
                  <Route path='/usersignin' element={<UserSignin/>}/>
                  <Route path='/usersignup' element={<UserSignup/>}/>
                  <Route path='/admindashboard' element={<AdminDashboard/>}/>
                  <Route path='/adminsignin' element={<AdminSignin/>}/>
                  <Route path='/adminsignup' element={<AdminSignup/>}/>
                  <Route path='/createcolorpalette' element={<CreateColorPalette/>}/>
                </Routes>
              </BrowserRouter>
            </SignedInUserDetailsState>
          </SignedInAdminDetailsState>
        </ConfirmState>
      </AlertState>
    </ProgressBarState>
  )
}

export default App
