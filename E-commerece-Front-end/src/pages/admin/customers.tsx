import { ReactElement, useEffect, useId, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import { Skeleton } from "../../Component/Loader";
import AdminSidebar from "../../Component/admin/AdminSidebar";
import TableHOC from "../../Component/admin/TableHOC";
import { useAllUserQuery, useDeleteUserMutation } from "../../redux/api/userApi";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { resposneToast } from "../../utils/freature";


interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];


const Customers = () => {

  const {user} =  useSelector(
    (state : RootState) => state.userReducer
  );

  const {isLoading, isError,data,error,} = useAllUserQuery(user?._id!);

  if(isError)
    { 
       const err = error as CustomError;
       toast.error(err.data.message);
    }

  const [rows, setRows] = useState<DataType[]>([]);
  
     const [deleteUser] =  useDeleteUserMutation();
   
  const deleteUserHandler = async(userId :string)=>{
    const res = await deleteUser({ userId ,adminId :user?._id!});
    resposneToast(res , null, "");
  }

  useEffect(()=>{
    if(data)
      {
        setRows(data.users?.map((i)=>({
          avatar : <img src={i.photo} alt={i.name} />,
          name : i.name,
          gender : i.gender,
          email : i.email,
          role : i.role,
          action :( 
          <button 
          onClick={()=>deleteUserHandler(i._id)}>
            <FaTrash/>
            </button>)
        }))
      );
      }
  },[data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar/>
      <main>{ isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
