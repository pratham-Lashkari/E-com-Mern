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