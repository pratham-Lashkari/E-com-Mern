import { Link } from "react-router-dom";
import ProductCard from "../Component/Product-cart";
import toast from "react-hot-toast";
import { useLatestProductQuery } from "../redux/api/productApi";
import { Skeleton } from "../Component/Loader";
import { CartItemsType } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCartItems } from "../redux/reducer/cartReducer";

export default function Home(){


  const {data ,isLoading , isError}  =  useLatestProductQuery("");
  const dispatch = useDispatch();

  if (isError) {
    toast.error("Fetching failed");
  }

  const addToCarTHandler =(cartItems : CartItemsType)=>{
    if(cartItems.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCartItems(cartItems));
    toast.success("Added to cart");
  }
  
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">More</Link>
      </h1>
      <main>
      { 
      isLoading ? ( <Skeleton/> ): 
       (data?.products.map((i) => (
          <ProductCard
            key={i._id}
            productId={i._id!}
            name={i.name}
            price={Number(i.price)}
            stock={i.stock}
            handler={addToCarTHandler}
            photo={i.photo}
          />
        ))
        )}
      </main>
    </div>
  )
}
