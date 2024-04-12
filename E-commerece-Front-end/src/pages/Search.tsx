import { setsEqual } from "chart.js/helpers";
import { useState } from "react"
import ProductCard from "../Component/Product-cart";

export default function Search() {

  const [search , setSearch] = useState("");
  const [sort , setSort] = useState("");
  const [maxPrice , setMaxPrice] = useState(10000);
  const [category , setCategory] = useState("");
  const [page , setPage] = useState(4);

  const  addToCardHandler = ()=>{}
  const isPrevPage = true;
  const isNextPage = true;

  return (
    <div className="product-search-page">
      
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
         <select 
         value={sort}
         onChange={(e)=>setSort(e.target.value)} 
         >
         <option value="">None</option>
         <option value="asc">Price(Low to High)</option>
         <option value="dsc">None (High to Low)</option>
         </select>
        </div>

        <div>
          <h4>Max Price : {maxPrice || ""}</h4>
         <input 
         type="range"
         min={100}
         max={10000}
         value={maxPrice}
         onChange={(e)=>setMaxPrice(Number(e.target.value))}/> 
        </div>

        <div>
          <h4>Category</h4>
         <select 
         value={sort}
         onChange={(e)=>setCategory(e.target.value)} 
         >
         <option value="">all</option>
         <option value="">Sample 1</option>
         <option value="">Sample 2</option>
         </select>
        </div>

      </aside>

      <main>
        <h1>Products</h1>
        <input 
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)} />

        <div className="search-product-list">
          <ProductCard 
          productId="afdsfsdf"
          name="Mackbook"
          price={4545}
          stock={435}
          handler={addToCardHandler}
          photo="https://www.apple.com/newsroom/images/product/mac/standard/Apple_MacBook-Pro_14-16-inch_10182021_big.jpg.small_2x.jpg"/>
        </div>

         <article>
          <button 
          disabled={!isPrevPage} 
          onClick={()=>setPage((prev)=>prev-1)}
          >Prev</button>

          <span>
            {page} of {4}
          </span>

            <button  
            disabled={!isNextPage} 
            onClick={()=>(setPage(()=>page+1))}
            >Next</button>
       
         </article>
      </main>
    </div>
  )
}
