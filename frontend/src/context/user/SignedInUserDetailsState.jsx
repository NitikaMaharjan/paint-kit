import { useContext } from "react";
import AlertContext from "../alert/AlertContext";
import SignedInUserDetailsContext from "./SignedInUserDetailsContext";

export default function SignedInUserDetailsState(props) {

    const { showAlert } = useContext(AlertContext);
    
    const fetchSignedInUserDetails = async() => {
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/fetchuserdetails`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authtoken": localStorage.getItem("userAuthToken")
                }
            });
            const json = await response.json();

            if(json.success){
                localStorage.setItem("user_token", true);
                localStorage.setItem("user_id", json.signedInUserDetails._id);
                localStorage.setItem("user_email", json.signedInUserDetails.user_email);
                localStorage.setItem("user_username", json.signedInUserDetails.user_username);
            }else{
                localStorage.removeItem("userSignedIn");
                localStorage.removeItem("userAuthToken");
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!");
        }
    }

    return (
        <SignedInUserDetailsContext.Provider value={{ fetchSignedInUserDetails }}>
            {props.children}
        </SignedInUserDetailsContext.Provider>
    );
}