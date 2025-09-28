import { useContext } from "react";
import SignedInUserDetailsContext from "./SignedInUserDetailsContext";
import AlertContext from "../alert/AlertContext";

export default function SignedInUserDetailsState(props) {

    const { showAlert } = useContext(AlertContext);
    
    const fetchSignedInUserDetails = async()=>{
        try{
            const response = await fetch(`http://localhost:5000/api/auth/user/fetchuserdetails`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authtoken": localStorage.getItem("userAuthToken")
                }
            });
            const json = await response.json();

            if(json.success){
                localStorage.setItem("user_token", true);
                localStorage.setItem("user_email", json.signedInUserDetails.email);
                localStorage.setItem("user_username", json.signedInUserDetails.username);
            }else{
                localStorage.removeItem("userSignedIn");
                localStorage.removeItem("userAuthToken");
                showAlert("#d64242e0", "Server error", json.error);
            }
        }catch(err){
            showAlert("#d64242e0", "Server error", "Network error. Please check your connection or try again later!");
        }
    }

    return(
        <SignedInUserDetailsContext.Provider value={{fetchSignedInUserDetails}}>
            {props.children}
        </SignedInUserDetailsContext.Provider>
    );
}