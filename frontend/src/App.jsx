import './App.css'
// import Signup from './components/auth/admin/Signup'
import Signin from './components/auth/admin/Signin'

function App() {

  return (
    <>
      <div className="flex justify-center" style={{marginTop: "60px"}}>
        {/* <Signup/> */}
        <Signin/>
      </div>
    </>
  )
}

export default App
