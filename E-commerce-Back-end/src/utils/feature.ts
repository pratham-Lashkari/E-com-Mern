import {  Document,  } from "mongoose";
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
    if(admin)
      {
        const adminKeys : string[] = ["admin-stats" , "admin-pie-charts" , "admin-bar-charts", "admin-Line-charts"]
        myCache.del(adminKeys)
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
  
  const percent = (thisMonth  / lastMonth) * 100;
  return percent;
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
};


interface myDocument extends Document {
  createdAt : Date,
  discount? : number
  total? : number
}
type FuncProps = {
  length : number,
  docArr : myDocument[],
  today : Date,
  property? : "discount" | "total"
};

export const getChartsData = ({length , docArr, today , property}:FuncProps)=>{

  const data : number[] = new Array(length).fill(0);

         docArr.forEach((i)=>{
            const creationDate = i.createdAt;
            const monthdiff =  (today.getMonth() - creationDate.getMonth() + 12)%12;

            if(monthdiff < length)
              {
                 data[6 - monthdiff - 1] += property ? i[property]! : 1;
              }
         });
    return data;
};