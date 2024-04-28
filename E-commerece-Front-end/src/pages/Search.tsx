import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Skeleton } from "../Component/Loader";
import ProductCard from "../Component/Product-cart";
import { useCategoriesQuery, useSerarchProductQuery } from "../redux/api/productApi";
import { addToCartItems } from "../redux/reducer/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItemsType } from "../types/types";

export default function Search() {

      const{ data : categoryResponse , 
        isLoading : loadingCategory , 
        isError , 
        error } = useCategoriesQuery("");
      
      const dispatch = useDispatch()
        
        const [search , setSearch] = useState("");
        const [sort , setSort] = useState("");
        const [maxPrice , setMaxPrice] = useState(10000);
        const [category , setCategory] = useState("");
        const [page , setPage] = useState(1);
        
        const { data : searchedData , 
          isLoading : productLoading , 
          isError: productIsError,
          error: productError  } = useSerarchProductQuery({
          search , 
           sort , 
          category ,
           page , 
          price : maxPrice });


          const addToCarTHandler =(cartItems : CartItemsType)=>{
            if(cartItems.stock < 1) return toast.error("Out of Stock");
            dispatch(addToCartItems(cartItems));
            toast.success("Added to cart");
          }
        const isPrevPage = page>1;
        const isNextPage = page < searchedData?.totalLength!;

  if(isError)
    {
       const err = error as CustomError;
       toast.error(err.data.message);
    }

    if (productIsError) {
      const err = productError as CustomError;
      toast.error(err.data.message);
    }


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
         max={100000}
         value={maxPrice}
         onChange={(e)=>setMaxPrice(Number(e.target.value))}/> 
        </div>

        <div>
          <h4>Category</h4>
         <select 
         value={sort}
         onChange={(e)=>setCategory(e.target.value)} 
         >
         <option value="">ALL</option>
          { !loadingCategory &&  categoryResponse?.category.map((i)=>(
              <option key={i} value={i}>{i.toUpperCase()}</option>
          ))
          }
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

        {productLoading ? (
          <Skeleton length={10} />
        ) :
        (<div className="search-product-list">
         { searchedData?.products.map((i)=>(
            <ProductCard 
            key={i._id}
            productId={i._id!}
            name={i.name}
            price={Number(i.price)}
            stock={i.stock}
            handler={addToCarTHandler}
            photo={i.photo}/>
           ))
         }
        </div>
      )}
          {
            searchedData && searchedData.totalLength >= 1 && (
              <article>
              <button 
              disabled={!isPrevPage} 
              onClick={()=>setPage((prev)=>prev-1)}
              >Prev</button>
    
              <span>
                {page} of {searchedData.totalLength}
              </span>
    
                <button  
                disabled={!isNextPage} 
                onClick={()=>(setPage((prev)=>prev+1))}
                >Next</button>
          
             </article>
            )
          }

        
      </main>
    </div>
  )
}
