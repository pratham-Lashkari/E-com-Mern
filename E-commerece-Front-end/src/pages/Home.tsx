import { Link } from "react-router-dom";
import ProductCard from "../Component/Product-cart";

export default function Home() {

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
      <ProductCard  
        productId="afdsfsdf"
        name="Mackbook"
        price={4545}
        stock={435}
        handler={addToCardHandler}
        photo="https://www.apple.com/newsroom/images/product/mac/standard/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.small_2x.jpg"
        />

      </main>
    </div>
  )
}
