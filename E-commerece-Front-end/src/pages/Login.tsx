import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userApi";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { Navigate } from "react-router-dom";

export default function Login() {

  const [gender , setGender] = useState("");
  const [date , setDate] = useState("");
  const [login] =  useLoginMutation();

    const loginHandler = async()=>{
      try {
         const provider = new GoogleAuthProvider();
         const {user} =   await signInWithPopup(auth,provider);

         const res = await login({
          _id : user.uid,
          name : user.displayName!,
          photo : user.photoURL!,
          gender,
          email : user.email!,
          role : "User",
          dob  :date
         });

         if("data" in res)
          {
              toast.success(res.data.message);
              <Navigate to={"/"}/>
          }
          else{
            const error = res.error as FetchBaseQueryError;
            const {message} = error.data as MessageResponse;
            toast.error(message);
          }

      } catch (error) {
        console.log(error)
        toast.error("Sign In fail");
      }
    }

  return (
    <div className="login" >
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label>Gender</label>
          <select 
          value={gender} 
          onChange={(e)=>setGender(e.target.value)}
           >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
           </select>
        </div>

        <div>
          <label>Date of birth</label>
          <input 
          type="date"
          value={date} 
          onChange={(e)=>setDate(e.target.value)}/>
        </div>
        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler} >
            <FcGoogle/>
            <span>Sigin In With Google</span>
          </button>
        </div>
      </main>
    </div>
  )
}
