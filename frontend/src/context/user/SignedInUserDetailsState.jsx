import SignedInUserDetailsContext from "./SignedInUserDetailsContext";

export default function SignedInUserDetailsState(props) {
    const fetchSignedInUserDetails = async()=>{
        try{
            const response = await fetch(`http://localhost:5000/api/auth/user/fetchuserdetails`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authtoken": localStorage.getItem("userAuthToken")
                }
            });
            const signedInUserDetails = await response.json();
            localStorage.setItem("user_email", signedInUserDetails.email);
            localStorage.setItem("user_username", signedInUserDetails.username);
        }catch(err){
            alert("Network error. Please check your connection or try again later!")
        }
    }

    return(
        <SignedInUserDetailsContext.Provider value={{fetchSignedInUserDetails}}>
            {props.children}
        </SignedInUserDetailsContext.Provider>
    );
}