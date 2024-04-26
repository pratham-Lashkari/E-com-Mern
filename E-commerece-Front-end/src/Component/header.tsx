import { useState } from 'react'
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { User } from '../types/types';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

interface PropType {
  user : User|null
}
export default function Header({user}:PropType) {

  const [isOpen , setisOpen] = useState<boolean>(false);

  const logoutHandler = async()=>{
    try {
      await signOut(auth);
      toast.success("Sign out successfully");
    } catch (error) {
      toast.error("Sign out Failed");
    }
  }
  return (
    <nav className='header'>
      <Link  onClick={()=>setisOpen(false)} to={"/"} >Home</Link>
      <Link onClick={()=>setisOpen(false)} to={"/search"} ><FaSearch/></Link>
      <Link onClick={()=>setisOpen(false)} to={"/cart"} ><FaShoppingBag/></Link>
      {
        user?._id ? (
          <>
          <button onClick={()=>setisOpen((prev)=>!prev)}>
            <FaUser/>
          </button>
          <dialog open={isOpen}>
            <div>{user.role === "admin"&&(
              <Link to={"/admin/dashboard"}>Admin</Link>
            )}
             <Link to={"/orders"}>Orders</Link>
             <button onClick={logoutHandler}>
              <FaSignOutAlt/>
             </button>
             </div>
          </dialog>
          </>
        ):<Link to={"/login"} onClick={()=>(logoutHandler)} ><FaSignInAlt/></Link>
      }
    </nav>
  )
}
