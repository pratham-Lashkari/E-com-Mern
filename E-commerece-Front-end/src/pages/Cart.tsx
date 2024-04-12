import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../Component/Cart-item";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId : "afsdfsdfdsf",
    photo : "https://www.apple.com/newsroom/images/product/mac/standard/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.small_2x.jpg",
    name : "Mackbook",
    price : 34334,
    quantity : 2,
    stock : 10
  }
];
const subTotal = 4000;
const tax = Math.round(subTotal * 0.18);
const shippingCharges = 200;
const total = subTotal * tax + shippingCharges;
const discount = 400;

export default function Cart() {
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
          <CartItem  key={i} cartItems={item}  />
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
