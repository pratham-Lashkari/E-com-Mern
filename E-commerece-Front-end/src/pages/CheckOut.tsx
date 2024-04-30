import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useNewOrderMutation } from '../redux/api/orderApi';
import { resetCart } from '../redux/reducer/cartReducer';
import { RootState } from '../redux/store';
import { NewOrderTypes } from '../types/api-types';
import { resposneToast } from '../utils/freature';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY); 

const CheckoutForm =()=>{

  const [isProcessing , setIsProcessing] = useState<boolean>();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch =   useDispatch();


  const {user} =  useSelector(
    (state : RootState) => state.userReducer
  );

  const {
     shippingInfo,
     cartItems,
     subTotal,
     tax,
     discount,
     shippingCharges,
     total,} = useSelector((state :RootState )=> state.cartReducer)

    const [newOrder] =   useNewOrderMutation();

    const submitHandler = async(e : FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      
      if(!stripe || !elements) return;
      setIsProcessing(true);
      
      const orderData:NewOrderTypes = {
        shippingInfo,
        orderItems:cartItems,
         subTotal,
         tax,
         discount,
         shippingCharges,
         total,
         userId : user?._id!
      };

   const {paymentIntent , error} =  await stripe.confirmPayment({
      elements,
      confirmParams : {return_url : window.location.origin},
      redirect :"if_required"
    });
   
    if(error)
      {
        setIsProcessing(false);
        return toast.error(error.message || "Something Went Wrong")
      }
    if(paymentIntent.status === "succeeded")
      {
        const res = await newOrder(orderData);
        dispatch(resetCart());
        resposneToast(res, navigate , "/orders")
      }
      setIsProcessing(false);
  }

  return <div className="checkout-container">

    <form onSubmit={submitHandler}>
      <PaymentElement/>
      <button type='submit' disabled={isProcessing}>
        {
          isProcessing ? "Processing..." : "Pay"
        }
      </button>
    </form>

  </div>
}

export default function CheckOut() {

  const location = useLocation();
  const clientSecret : string | undefined = location.state;
  if(!clientSecret) return <Navigate to={"/Shipping"}/>
  return (
    <Elements 
    stripe={stripePromise} 
    options={{
      clientSecret,
    }}>
    <CheckoutForm />
  </Elements>
  )
}
