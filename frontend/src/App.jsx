import './App.css'
// import AdminSignup from './components/auth/admin/AdminSignup'
import AdminSignin from './components/auth/admin/AdminSignin'
// import UserSignup from './components/auth/user/UserSignup'
// import UserSignin from './components/auth/user/UserSignin'

function App() {

  return (
    <>
      <div className="flex justify-center items-center" style={{height: "100vh"}}>
        {/* <AdminSignup/> */}
        <AdminSignin/>
        {/* <UserSignup/> */}
        {/* <UserSignin/> */}
      </div>
    </>
  )
}

export default App
