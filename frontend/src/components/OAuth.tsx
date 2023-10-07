import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase"; 
import { loginSuccess } from '../redux/user/userSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleAuth = async () => { 
        
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app); 

            const result = await signInWithPopup(auth, provider);

            const res = await fetch("/api/auth/google", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name:result.user.displayName, email:result.user.email,photo:result.user.photoURL}),
            });
            const data = await res.json();
            dispatch(loginSuccess(data.user));
            navigate("/");
            
        } catch (error) {
            console.log("could not authenticate with google",error);
        }

    };
  return (
    <button onClick={handleGoogleAuth} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 ">
      continue with google
    </button>
  );
};

export default OAuth;
