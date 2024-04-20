import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/feature.js";

export const getDashboardStats = TryCatch(async(req,res,next)=>{

    let stats = {};

    if(myCache.has("admin-stats"))
      {
        stats = JSON.parse(myCache.get("admin-stats") as string);
      }
    else{
      const today = new Date();
      const sixMonthAgo = new Date();
      sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6 );

      const thisMonth = {
        start : new Date(today.getFullYear() , today.getMonth() , 1),
        end : today
      }
      const lastMonth = {
        start : new Date(today.getFullYear(),today.getMonth() - 1 , 1),
        end : new Date(today.getFullYear() , today.getMonth() , 0)
      }
 
      const thisMonthProductPromise =  Product.find({
        createdAt:{
          $gte : thisMonth.start,
          $lte : thisMonth.end
        }
      });
      const lastMonthProductPromise =  Product.find({
        createdAt:{
          $gte : lastMonth.start,
          $lte : lastMonth.end
        }
      });
      const thisMonthUserPromise =  User.find({
        createdAt:{
          $gte : thisMonth.start,
          $lte : thisMonth.end
        }
      });
      const lastMonthUserPromise =  User.find({
        createdAt:{
          $gte : lastMonth.start,
          $lte : lastMonth.end
        }
      });
      const thisMonthOrderPromise =  Order.find({
        createdAt:{
          $gte : thisMonth.start,
          $lte : thisMonth.end
        }
      });
      const lastMonthOrderPromise =  Order.find({
        createdAt:{
          $gte : lastMonth.start,
          $lte : lastMonth.end
        }
      });
      const lastSixMonthAgoPromise =   Order.find({
        createdAt:{
          $gte : sixMonthAgo,
          $lte : today
        }
      });

      const latestTransactionPromise = Order.find({}).select(
        ["orderItems","discount","total","status"]).limit(4);

      const [
        thisMonthProduct,
        lastMonthProduct,
        thisMonthUser,
        lastMonthUser,
        thisMonthOrder,
        lastMonthOrder,
        productCount ,
        userCount , 
        allOrders,
        lastSixMonthAgo,
        categories,
        femaleCount,
        latestTransaction
      ] = await Promise.all([
        thisMonthProductPromise,
        lastMonthProductPromise,
        thisMonthUserPromise,
        lastMonthUserPromise,
        thisMonthOrderPromise,
        lastMonthOrderPromise,
        Product.countDocuments(),
        User.countDocuments(),
        Order.find({}).select("total"),
        lastSixMonthAgoPromise,
        Product.distinct("category"),
        User.countDocuments({gender : "female"}),
        latestTransactionPromise
      ]);

      const revenues = allOrders.reduce(
        (total , order ) => total + (order.total || 0),0
      )
      const thisMonthRevenue = thisMonthOrder.reduce(
        (total , order) => total + (order.total || 0),0
      );
      const lastMonthRevenue = lastMonthOrder.reduce(
        (total , order) => total + (order.total || 0),0
      );
      const revenue = calculatePercentage(thisMonthRevenue , lastMonthRevenue);
      
     
        const count = {
          revenues,
          user : userCount,
          product : productCount,
          order : allOrders.length
        }
 
        // For all cards
       const changePercent = {
          revenue,
          product : calculatePercentage(
            thisMonthProduct.length , 
            lastMonthProduct.length ),
          user : calculatePercentage(
              thisMonthUser.length , 
              lastMonthUser.length ),
          order :calculatePercentage(
            thisMonthOrder.length , 
            lastMonthOrder.length )
         }

        //  For bar chart 
         const orderMonthCounts = new Array(6).fill(0);
         const orderMonthRevenue = new Array(6).fill(0);

         lastSixMonthAgo.forEach((order)=>{
            const creationDate = order.createdAt;
            const monthdiff =  today.getMonth() - creationDate.getMonth();

            if(monthdiff < 6)
              {
                 orderMonthCounts[6 - monthdiff - 1] += 1;
                 orderMonthRevenue[6 - monthdiff - 1] += order.total
              }
         });

          // Categories count and theri items for inventry
         const categoryPromise = categories.map((category)=>Product.countDocuments({category}));
         const categoriesCount = await Promise.all(categoryPromise);
         const categoryCount:Record<string,number>[] = [];

          categories.forEach((category,i)=>
          {
            categoryCount.push({
                [category] :Math.round(( categoriesCount[i] / productCount) *100),
              });
          });

          // For gender ratio
          const userRatio = {
            male : userCount - femaleCount,
            female : femaleCount
          };

          const modifiedLatestTransaction = latestTransaction.map( i => ({
            _id : i._id,
            discount : i.discount,
            amount : i.total,
            quality : i.orderItems.length,
            status : i.status 
          }))

      stats = {
        categoryCount,
        count,
        changePercent,
        chart :{
          orderMonthCounts,
          orderMonthRevenue
        },
        userRatio,
        modifiedLatestTransaction
      };

        myCache.set("admin-stats" , JSON.stringify(stats));

    }
    return res.status(200).json({
      success : true,
      stats
    });
});

export const getPieCharts = TryCatch(async(req,res,next)=>{
  
});


export const getBarCharts = TryCatch(async(req,res,next)=>{
  
});

export const getLineCharts = TryCatch(async(req,res,next)=>{
  
});
