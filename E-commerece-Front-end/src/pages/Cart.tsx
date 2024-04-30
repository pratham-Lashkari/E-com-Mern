import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../Component/Cart-item";
import { addToCartItems, calculatePrice, discountApply, removeCartItems } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { CartItemsType } from "../types/types";



export default function Cart() {


  const {cartItems , subTotal, tax , shippingCharges , total , discount} = useSelector(
    (state : RootState) => state.cartReducer )

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
    const {token,cancel } = axios.CancelToken.source();
    const timeOutID = setTimeout(() => {

      axios.get(`${server}/api/v1/payment/discount?cupon=${cuponCode}` ,
        {
          cancelToken : token
        }
      )
      .then((res)=>{
        dispatch(discountApply(res.data.discount));
        dispatch(calculatePrice())
        setIsValid(true)
      })
      .catch(()=>{
        dispatch(discountApply(0));
        dispatch(calculatePrice())
        setIsValid(false)
      })
    
    }, 1000);

    return ()=>{
      clearTimeout(timeOutID);
      cancel()
      setIsValid(false);
    }
  },[cuponCode]);

  useEffect(()=>{
  dispatch(calculatePrice())
  },[cartItems])

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
