import { useContext } from "react";
import AlertContext from "../alert/AlertContext";
import SignedInAdminDetailsContext from "./SignedInAdminDetailsContext";

export default function SignedInAdminDetailsState(props) {

    const { showAlert } = useContext(AlertContext);
    
    const fetchSignedInAdminDetails = async() => {
        try{
            const response = await fetch(`http://localhost:5000/api/auth/admin/fetchadmindetails`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authtoken": localStorage.getItem("adminAuthToken")
                }
            });
            const json = await response.json();

            if(json.success){
                localStorage.setItem("admin_token", true);
                localStorage.setItem("admin_id", json.signedInAdminDetails._id);
                localStorage.setItem("admin_email", json.signedInAdminDetails.email);
                localStorage.setItem("admin_username", json.signedInAdminDetails.username);
            }else{
                localStorage.removeItem("adminSignedIn");
                localStorage.removeItem("adminAuthToken");
                showAlert("Error", json.error);
            }
        }catch(err){
            showAlert("Error", "Network error. Please check your connection or try again later!")
        }
    }

    return(
        <SignedInAdminDetailsContext.Provider value={{ fetchSignedInAdminDetails }}>
            {props.children}
        </SignedInAdminDetailsContext.Provider>
    );
}