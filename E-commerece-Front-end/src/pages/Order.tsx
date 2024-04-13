import { ReactElement, useState } from "react";
import TableHOC from "../Component/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";

type DataType = {
   _id: string;
   amount : number;
   quantity : number;
   discount : number;
   status  : ReactElement;
   action : ReactElement;

}

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

  const [rows] = useState<DataType[]>([
    {
      _id: "fsadfsfdf",
    amount : 2323,
    quantity : 12,
    discount : 32,
    status  : <span className="red"> Processing</span>,
    action : <Link to={'/order/asfsdfds'}>View</Link>,

    }
  ])


  const Table = TableHOC<DataType>(column , rows , "dashboard-product-box" , "Orders", true)();
  return (
    <div className="container">
      <h1>My Orders</h1>
      {Table}
    </div>
  )
}
