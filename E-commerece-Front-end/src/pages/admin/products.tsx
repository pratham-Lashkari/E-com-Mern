import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../Component/admin/AdminSidebar";
import TableHOC from "../../Component/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productApi";
import { server } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { Skeleton } from "../../Component/Loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];



const Products = () => {

      const {user} =  useSelector((state : {userReducer : UserReducerInitialState})=>state.userReducer);

      const [rows, setRows] = useState<DataType[]>([]);

      const {data,isError,error,isLoading} = useAllProductsQuery(user?._id!);
      if(isError)
        {
           const err = error as CustomError;
           toast.error(err.data.message);
        }

      useEffect(()=>{
        if(data)
          {
            setRows(data.products.map((i)=>({
              photo : <img src={`${server}/${i.photo}`}/>,
              name : i.name,
              price : Number(i.price),
              stock : i.stock ,
              action : <Link to={`/admin/product/${i._id}`}>Manage</Link>
          })
          ));
          }
      },[data]);
  

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20}/> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
