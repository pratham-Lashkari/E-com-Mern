import { Link } from "react-router-dom";
import ProductCard from "../Component/Product-cart";
import toast from "react-hot-toast";
import { useLatestProductQuery } from "../redux/api/productApi";
import { Skeleton } from "../Component/Loader";

export default function Home(){


  const {data ,isLoading , isError}  =  useLatestProductQuery("");

  if (isError) {
    toast.error("Fetching failed");
  }

  const addToCardHandler =()=>{

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
            productId={i._id}
            name={i.name}
            price={Number(i.price)}
            stock={i.stock}
            handler={addToCardHandler}
            photo={i.photo}
          />
        ))
        )}
      </main>
    </div>
  )
}
