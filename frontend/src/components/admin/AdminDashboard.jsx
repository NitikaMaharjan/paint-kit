import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {

  let navigate = useNavigate();

  const handleSignOut = ()=> {
    let ans = window.confirm("Are you sure?");
    if (ans) {
      localStorage.removeItem("adminSignedIn");
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("admin_email");
      localStorage.removeItem("admin_username");
      navigate("/adminsignin");
      alert("You've signed out. See you next time!");
    }
  }

  useEffect(() => {
    if(!localStorage.getItem("adminSignedIn")){
      navigate("/adminsignin");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h1>Welcome, {localStorage.getItem("admin_username")}!</h1>
      <button style={{position: "fixed", top: "32px", right: "32px"}} onClick={handleSignOut}><b>Sign out</b></button>
    </>
  )
}
