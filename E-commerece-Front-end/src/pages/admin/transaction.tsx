import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { Skeleton } from "../../Component/Loader";
import AdminSidebar from "../../Component/admin/AdminSidebar";
import TableHOC from "../../Component/admin/TableHOC";
import { useAllOrdersQuery } from "../../redux/api/orderApi";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {

  const {user} =  useSelector(
    (state : RootState) => state.userReducer
  );

  const {isLoading, isError,data,error,} = useAllOrdersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if(isError)
    { 
       const err = error as CustomError;
       toast.error(err.data.message);
    }

    useEffect(()=>{
      if(data)
        {
          setRows(data.orders.map((i)=>({
            user : i.user.name,
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

  
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{ isLoading ? <Skeleton length={20}/>: Table}</main>
    </div>
  );
};

export default Transaction;
