import { useState } from 'react'
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'


const user = {_id:"",role:""}
export default function Header() {

  const [isOpen , setisOpen] = useState<boolean>(false);
  const logoutHandler =()=>{
    setisOpen(false);
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
        ):<Link to={"/login"} onClick={()=>(console.log("Login"))} ><FaSignInAlt/></Link>
      }
    </nav>
  )
}
