import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignedInUserDetailsState from './context/user/SignedInUserDetailsState';
import Home from './components/Home';
import UserHome from './components/user/UserHome';
import UserSignin from './components/user/UserSignin';
import UserSignup from './components/user/UserSignup';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSignin from './components/admin/AdminSignin';
import AdminSignup from './components/admin/AdminSignup';

function App() {
  return (
    <div className="flex justify-center items-center" style={{height: "100vh"}}>
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
          </Routes>
        </BrowserRouter>
      </SignedInUserDetailsState>
    </div>
  )
}

export default App
