import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../Component/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer-types";
import { useAllOrdersQuery } from "../redux/api/orderApi";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../Component/Loader";

type DataType = {
   _id: string;
   amount : number;
   quantity : number;
   discount : number;
   status  : ReactElement;
   action : ReactElement;
};

const column: Column<DataType>[]= [
  {
    Header : "ID",
    accessor : "_id",
  },
  {
    Header : "Quantity",
    accessor : "quantity",
  },
  {
    Header : "Amount",
    accessor : "amount",
  },
  {
    Header : "Discount",
    accessor : "discount",
  },
  {
    Header : "Status",
    accessor : "status",
  },
  {
    Header : "Action",
    accessor : "action",
  },
]

export default function Order() {

  const [rows,setRows] = useState<DataType[]>([
    {
      _id: "fsadfsfdf",
    amount : 2323,
    quantity : 12,
    discount : 32,
    status  : <span className="red"> Processing</span>,
    action : <Link to={'/order/asfsdfds'}>View</Link>,

    }
  ]);

  const {user} =  useSelector(
    (state : {userReducer : UserReducerInitialState}) => state.userReducer
  );

  const {isLoading, isError,data,error,} = useAllOrdersQuery(user?._id!);

  if(isError)
    { 
       const err = error as CustomError;
       toast.error(err.data.message);
    }

    useEffect(()=>{
      if(data)
        {
          setRows(data.orders.map((i)=>({
            _id : i._id,
            quantity : i.orderItems.length,
            amount : i.total,
            discount : i.discount,
            status : <span className={
              i.status ==="Processing" ? "red" : 
              i.status === "Shipped" ? "green" : "purple"  
            } >{i.status}</span>,
            action : <Link to={`/admin/transaction/${i._id}`}>Manage</Link>})
          ));
    }},[data]);

  const Table = TableHOC<DataType>(column , rows , "dashboard-product-box" , "Orders", true)();
  
  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <Skeleton length={20}/> : Table}
    </div>
  )
}
