import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCacheType, OrderItemType } from "../types/user.js";

export const InvalidateCache =({product,
  order,
  admin}:InvalidateCacheType)=>{

     if(product)
      {
        const prodcutKeys : string[] = ["admin-Product",
        "category",
        "latest-Product"]
        myCache.del(prodcutKeys);
      }
}

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

}