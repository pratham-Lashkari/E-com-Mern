import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLoaderData, useLocation, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51PAt0BSFc59jQpA1cqazKlFqBPRvoiO8WlGWXunV3hvvmsRHIutbj0bmVq8LId51hq9o6xm2rKwbAQYpV9tB1n4D00Pd23Vccu'); 

const CheckoutForm =()=>{
  const [isProcessing , setIsProcessing] = useState<boolean>();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const submitHandler = async(e : FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    if(!stripe || !elements) return;
    setIsProcessing(true);

  const orderData = {};

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
          navigate("/orders")
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
