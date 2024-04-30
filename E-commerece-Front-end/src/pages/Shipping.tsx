import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippinInfo } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";

export default function Shipping() {
  
  
  const {cartItems , total} = useSelector(
    (state : RootState) => state.cartReducer );

    const navigate = useNavigate();
    const dispatch = useDispatch();
  
  useEffect(()=>{
    if(cartItems.length <= 0) return navigate("/cart")
  },[cartItems])

  const [shippingInfo , setShippingInfo] = useState({
    address : "",
    city : "",
    state : "",
    country:"",
    pincode : 0,
  });

  const changeHandler =(e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    setShippingInfo((prev)=>({
      ...prev , [e.target.name]: e.target.value  // Change "pincode" to "pinCode"
    }))
  }

  const submitHandler = async (e : FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    dispatch(saveShippinInfo(shippingInfo));
    try {
      const {data} = await axios.post(`${server}/api/v1/payment/create`,{
        amount : total
      },{
        headers:{
          "Content-Type" : "application/json"
        },
      });
      navigate("/pay" , {
        state : data.clientSecret
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  
  return (
    <div className="shipping">
      <button className="back-btn" onClick={()=>navigate("/Cart")}><BiArrowBack/></button>
 
      <form onSubmit={submitHandler}>
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
