import SignedInAdminDetailsContext from "./SignedInAdminDetailsContext";

export default function SignedInAdminDetailsState(props) {
    const fetchSignedInAdminDetails = async()=>{
        try{
            const response = await fetch(`http://localhost:5000/api/auth/admin/fetchadmindetails`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authtoken": localStorage.getItem("adminAuthToken")
                }
            });
            const signedInAdminDetails = await response.json();
            localStorage.setItem("admin_email", signedInAdminDetails.email);
            localStorage.setItem("admin_username", signedInAdminDetails.username);
        }catch(err){
            alert("Network error. Please check your connection or try again later!")
        }
    }

    return(
        <SignedInAdminDetailsContext.Provider value={{fetchSignedInAdminDetails}}>
            {props.children}
        </SignedInAdminDetailsContext.Provider>
    );
}