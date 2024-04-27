import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { InvalidateCache, calculatePercentage, getChartsData, getInventoryCount } from "../utils/feature.js";

export const getDashboardStats = TryCatch(async(req,res,next)=>{
  
    let stats = {};
    let key = "admin-stats"

    if(myCache.has(key))
      {
        stats = JSON.parse(myCache.get(key) as string);
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
            const monthdiff =  (today.getMonth() - creationDate.getMonth() + 12)%12;

            if(monthdiff < 6)
              {
                 orderMonthCounts[6 - monthdiff - 1] += 1;
                 orderMonthRevenue[6 - monthdiff - 1] += order.total
              }
         });

        // Categories count and theri items for inventry
        const categoryCount :Record<string,number>[] = await getInventoryCount({
          categories,
          productCount
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
          }));

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

      myCache.set(key , JSON.stringify(stats));

    }
    InvalidateCache({product  : true , admin : true});

    return res.status(200).json({
      success : true,
      stats
    });
});

export const getPieCharts = TryCatch(async(req,res,next)=>{
  
  let charts;
  let key = "admin-pie-charts";
  if(myCache.has(key))
  {
      charts = JSON.parse(myCache.get(key) as string);
  }
  else{

    const allOrderPromise = Order.find({}).select([
    "shippingCharges" , 
    "total" , 
    "discount" , 
    "subtotal" , 
    "tax"]);

    const [processingOrder , 
      shippingOrder , 
      deliveredOrder, 
      categories, 
      productCount ,
      productOutOfStocks,
      allOrders,
      allUser,
      adminUser,
      customerUser
      ] = await Promise.all([
      Order.countDocuments({status : "Processing"}),
      Order.countDocuments({status : "Shipped"}),
      Order.countDocuments({status : "Delivered"}),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({stock : 0}),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({role : "admin"}),
      User.countDocuments({role:"user"})
    ]);

    const orderFullFillmentRation = {
      processing : processingOrder,
      shipped  : shippingOrder,
      delivered : deliveredOrder  
    };
    const productCategories :Record<string,number>[] = await getInventoryCount({
      categories,
      productCount
    });
    const stockAvaliablity = {
      inStock : productCount - productOutOfStocks,
      outStock :  productOutOfStocks
    };

    const grossIncome = allOrders.reduce((prev,order)=> (prev + (order.total || 0)),0);
    const discount = allOrders.reduce((prev,order)=> prev + (order.discount || 0) , 0);
    const productionCost = allOrders.reduce((prev,order) => prev + (order.shippingCharges || 0),0);
    const burnt = allOrders.reduce((prev,order) => prev + (order.tax || 0),0);
    const marketingCost = Math.round(grossIncome* (30/100));
    const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin, 
      discount ,
      productionCost ,
      burnt ,
      marketingCost 
    };

    const userAgeGroup = {
      teen : allUser.filter((i)=>i.age < 20).length,
      adult : allUser.filter((i) => i.age >= 20 && i.age < 40).length,
      old : allUser.filter((i) => i.age >= 40).length,
    }

    const adminCustomer = {
      user : customerUser,
      admin : adminUser
    }

    charts = {
      orderFullFillmentRation,
      productCategories,
      stockAvaliablity,
      revenueDistribution,
      adminCustomer,
      userAgeGroup
    }
    myCache.set(key , JSON.stringify(charts));

  }
  InvalidateCache({product  : true , admin : true});

    return res.status(200).json({
      success : true,
      charts
    }); 

});


export const getBarCharts = TryCatch(async(req,res,next)=>{
  let key = "admin-bar-charts";
  let charts;

  if(myCache.has(key))
  {
    charts =JSON.parse(myCache.get(key) as string);
  }
  else{
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth()-6);

    const tweleveMonthAgo = new Date();
    tweleveMonthAgo.setMonth(tweleveMonthAgo.getMonth()-12);

    const sixMonthProductPromise = Product.find({
      createdAt:{
        $gte : sixMonthAgo,
        $lte : today
      }
    }).select("createdAt");
    const sixMonthUserPromise = User.find({
      createdAt:{
        $gte : sixMonthAgo,
        $lte : today
      }
    }).select("createdAt");

    const twelveMonthOrderPromise =  Order.find({
      createdAt:{
        $gte : tweleveMonthAgo,
        $lte : today
      }
    }).select("createdAt");
    const [users , products , orders] = await Promise.all([
      sixMonthUserPromise,
      sixMonthProductPromise,
      twelveMonthOrderPromise
    ]);

    const ordersCounts = getChartsData({length : 12 , docArr : orders , today});
    const userCounts = getChartsData({length : 6 , docArr : users , today});
    const productsCounts = getChartsData({length : 6 , docArr : products , today});

    charts = {
      users : userCounts,
      products : productsCounts,
      orders : ordersCounts
    }
    myCache.set(key , JSON.stringify(key));
  }
  InvalidateCache({product  : true , admin : true});

  return res.status(200).send({
    success : true,
    charts
  });
});

export const getLineCharts = TryCatch(async(req,res,next)=>{
  
  let key = "admin-Line-charts";
  let charts;

  if(myCache.has(key))
  {
    charts =JSON.parse(myCache.get(key) as string);
  }
  else{

    const today = new Date();
    const tweleveMonthAgo = new Date();
    tweleveMonthAgo.setMonth(tweleveMonthAgo.getMonth()-12);

    const baseQuery = {
      createdAt:{
        $gte : tweleveMonthAgo,
        $lte : today
      }
    };
    const twelveMonthUserPromise =  User.find(baseQuery).select("createdAt");
    const twelveMonthProductPromise =  Product.find(baseQuery).select("createdAt");
    const twelveMonthOrderPromise =  Order.find(baseQuery).select(["createdAt" , "discount" , "total"]);

    const [users , products , orders] = await Promise.all([
      twelveMonthUserPromise,
      twelveMonthProductPromise,
      twelveMonthOrderPromise
    ]);

    const discount = getChartsData({length : 12 , docArr : orders , today, property : "discount"});
    const revenue = getChartsData({length : 12 , docArr : orders , today, property : "total"});
    const userCounts = getChartsData({length : 12 , docArr : users , today});
    const productsCounts = getChartsData({length : 6 , docArr : products , today});

    charts = {
      users : userCounts,
      products : productsCounts,
      discount ,
      revenue 
    };
    myCache.set(key , JSON.stringify(key));
  }
  InvalidateCache({product  : true , admin : true});

  return res.status(200).send({
    success : true,
    charts
  });
});
