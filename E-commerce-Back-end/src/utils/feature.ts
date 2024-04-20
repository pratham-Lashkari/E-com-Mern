import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCacheType, OrderItemType } from "../types/user.js";

export const InvalidateCache =({product,
  order,
  admin,
  key}:InvalidateCacheType)=>{

     if(product)
      {
        const prodcutKeys : string[] = ["admin-Product",
        "category",
        "latest-Product"]
        myCache.del(prodcutKeys);
      }
    if(order)
      {
          const orderKeys :string[] = [key!];
          myCache.del(orderKeys);
      }
};

export const reducedStock =  async(orderItems:OrderItemType[])=>{

  for(let i = 0 ; i<orderItems.length ; i++)
    {
      const order  = orderItems[i];
      const product = await Product.findById(order.productId);
      if(!product)
        {
           throw new Error("Product not found");
        }
        product.stock -= order.quantity;
        await product.save();
    }
};


export const calculatePercentage =(thisMonth:number , lastMonth:number)=>{

  if(lastMonth === 0)
    {
      return thisMonth*100;
    }
  
  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return percent.toFixed(0);
};



export const getInventoryCount = async ({categories , productCount}:{categories:string[] , productCount : number})=>{

  const categoryPromise = categories.map((category)=>Product.countDocuments({category}));
  const categoriesCount = await Promise.all(categoryPromise);
  const categoryCount:Record<string,number>[] = [];

          categories.forEach((category,i)=>
          {
            categoryCount.push({
                [category] :Math.round(( categoriesCount[i] / productCount) *100),
              });
          });
  return categoryCount;
}