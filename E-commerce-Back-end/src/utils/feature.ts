import { myCache } from "../app.js";
import { InvalidateCacheType } from "../types/user.js";

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