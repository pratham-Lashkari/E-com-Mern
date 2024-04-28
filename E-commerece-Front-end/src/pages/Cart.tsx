import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../Component/Cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { addToCartItems, cartReducer, removeCartItems } from "../redux/reducer/cartReducer";
import { CartItemsType } from "../types/types";
import toast from "react-hot-toast";



export default function Cart() {


  const {cartItems , subTotal, tax , shippingCharges , total , discount} = useSelector(
    (state : {cartReducer : CartReducerInitialState}) => state.cartReducer )

    const dispatch = useDispatch();

    const incrementHandler =(cartItems : CartItemsType)=>{
      if(cartItems.quantity >= cartItems.stock)return;
      dispatch(addToCartItems({...cartItems , quantity : cartItems.quantity+1}));
      toast.success("Added to cart");
    }
    const decrementHandler =(cartItems : CartItemsType)=>{
      if(cartItems.quantity <= 1)return;
      dispatch(addToCartItems({...cartItems , quantity : cartItems.quantity-1}));
      toast.success("Reomved form cart");
    }
    const removeHandler =(productId:string)=>{
      dispatch(removeCartItems(productId));
      toast.success("Reomved form cart");

   }


  const [cuponCode , setCuponCode] = useState<string>("")
  const [isValid , setIsValid] = useState<boolean>(false);

  useEffect(()=>{
    const timeOutID = setTimeout(() => {
      if(Math.random() > 0.5) setIsValid(true);
      else setIsValid(false);
    }, 1000);

    return ()=>{
      clearTimeout(timeOutID);
      setIsValid(false);
    }
  },[cuponCode]);

  return (
    <div className="cart">
      <main>
      {
        cartItems.length ? cartItems.map((item, i)=>(
          <CartItem  
          key={i} 
          cartItems={item} 
          incrementHandler={incrementHandler}
          decremntHandler={decrementHandler}
          removeHandler={removeHandler} />
        )) : <h1>No Items Added</h1>
      }

      </main>
      <aside>
        <p>SubTotal : ₹{subTotal}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
        <p>Tax : ₹{tax}</p>
        <p> Discount : <em className="red"> - ₹{discount}</em></p>
        <b>Total : ₹{total}</b>
        <input 
        type="text" 
        placeholder="Cupon Code"
        value={cuponCode}
        onChange={(e)=>(setCuponCode(e.target.value))}
        />
        {
          cuponCode && (isValid ? <span className="green">₹{discount} off using the <code>{cuponCode}</code></span>: <span className="red" >Invalid Cupon<VscError/> </span>)
        }
        {
          cartItems.length > 0 && <Link to={"/Shipping"}>Checkout</Link>
        }
      </aside>
    </div>
  )
}
