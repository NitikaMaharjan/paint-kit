import './App.css'
// import AdminSignup from './components/auth/admin/AdminSignup'
import AdminSignin from './components/auth/admin/AdminSignin'
// import UserSignup from './components/auth/user/UserSignup'
// import UserSignin from './components/auth/user/UserSignin'

function App() {

  const handleSignOut = ()=> {
    let ans = window.confirm("Are you sure?");
    if (ans) {
      localStorage.removeItem("signedIn");
      alert("You've signed out. See you next time!");
    }
  }
  
  return (
    <>
      <div className="flex justify-center items-center" style={{height: "100vh"}}>
        {
          localStorage.getItem("signedIn")?
            <button style={{position: "fixed", top: "32px", right: "32px"}} onClick={handleSignOut}><b>Sign out</b></button>
            :
            <></>
        }
        {/* <AdminSignup/> */}
        <AdminSignin/>
        {/* <UserSignup/> */}
        {/* <UserSignin/> */}
      </div>
    </>
  )
}

export default App
