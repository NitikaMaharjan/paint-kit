import { useNavigate } from "react-router-dom";

export default function UserHome() {

  let navigate = useNavigate();

  const handleSignOut = ()=> {
    let ans = window.confirm("Are you sure?");
    if (ans) {
      localStorage.removeItem("userSignedIn");
      localStorage.removeItem("userAuthToken");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_username");
      navigate("/usersignin");
      alert("You've signed out. See you next time!");
    }
  }

  return (
    <>
      {
        localStorage.getItem("userSignedIn")?
          <>
            <h1>Welcome, {localStorage.getItem("user_username")}!</h1>
            <button style={{position: "fixed", top: "32px", right: "32px"}} onClick={handleSignOut}><b>Sign out</b></button>
          </>
        :
          <div>UserHome</div>
      }
    </>
  )
}
