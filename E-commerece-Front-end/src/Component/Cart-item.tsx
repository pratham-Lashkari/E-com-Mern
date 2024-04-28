import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItemsType } from "../types/types";

type CartItemProps = {
  cartItems : CartItemsType;
  incrementHandler  : (cartitem : CartItemsType)=>void
  decremntHandler  : (cartitem : CartItemsType)=>void
  removeHandler  : (id : string)=>void
}
export default function CartItem({ 
  cartItems, 
  incrementHandler , 
  decremntHandler , 
  removeHandler,

}:CartItemProps) {

   const {photo , productId ,name , price , quantity } = cartItems;
   
  
  return (
    <div className="cart-item">
      
      <img src={`${server}/${photo}`} alt="" />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div>
        <button  onClick={()=>decremntHandler(cartItems)}>-</button>
        <p>{quantity}</p>
        <button  onClick={()=>incrementHandler(cartItems)}>+</button>
      </div>
      <button   onClick={()=>removeHandler(productId)}><FaTrash/></button>
    </div>
  )
}
