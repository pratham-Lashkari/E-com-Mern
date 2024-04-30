import { ChangeEvent, useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer-types";

export default function Shipping() {
  
  
  const {cartItems} = useSelector(
    (state : {cartReducer : CartReducerInitialState}) => state.cartReducer )
    const navigate = useNavigate();
  
  useEffect(()=>{
    if(cartItems.length <= 0) return navigate("/cart")
  },[cartItems])

  const [shippingInfo , setShippingInfo] = useState({
    address : "",
    city : "",
    state : "",
    country:"",
    pincode : "",
  });

  const changeHandler =(e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    setShippingInfo((prev)=>({
      ...prev , [e.target.name]: e.target.value  // Change "pincode" to "pinCode"
    }))
  }
  
  return (
    <div className="shipping">
      <button className="back-btn" onClick={()=>navigate("/Cart")}><BiArrowBack/></button>
 
      <form action="">
        <h1>Shipping Address</h1>

        <input 
        required
        type="text"
        placeholder="Address" 
        name="address" 
        value={shippingInfo.address}
        onChange={changeHandler} />

        <input 
        required
        type="text"
        placeholder="City" 
        name="city" 
        value={shippingInfo.city}
        onChange={changeHandler} />

        <input 
        required
        type="text"
        placeholder="State" 
        name="state" 
        value={shippingInfo.state}
        onChange={changeHandler} />
 
        <select 
        name="country"
        required
        value={shippingInfo.country} 
        onChange={changeHandler}
        >
         <option value="">Choose Country</option>
         <option value="india">India</option>
        </select>

       <input 
        required
        type="number"
        placeholder="Pincode" 
        name="pincode" 
        value={shippingInfo.pincode}
        onChange={changeHandler} />

        <button type="submit">Pay now</button>
      </form>
    </div>
  )
}
