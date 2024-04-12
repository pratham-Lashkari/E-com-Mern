import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type CartItemProps = {
  cartItems : any;
}
export default function CartItem({cartItems}:CartItemProps) {

   const {photo , productId ,name , price , quantity } = cartItems;
  return (
    <div className="cart-item">
      
      <img src={photo} alt="" />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div>
        <button>-</button>
        <p>{quantity}</p>
        <button>+</button>
      </div>
      <button><FaTrash/></button>
    </div>
  )
}
