import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import Loader from "./Component/Loader"
const Home  = lazy(()=>import("./pages/Home"))  
const Cart  = lazy(()=>import("./pages/Cart"))  
const Search  = lazy(()=>import("./pages/Search"))  
import "./styles/app.scss"
import { Toaster } from "react-hot-toast"
import Header from "./Component/header";
import { useDispatch, useSelector } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import { userExist, userNotExist } from "./redux/reducer/userReducer"
import { getUser } from "./redux/api/userApi"
import { UserReducerInitialState } from "./types/reducer-types"
import ProtectedRoute from "./Component/Protected-Route"
// Adming imports
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Order = lazy(() => import("./pages/Order"));

function App() {
  
   const dispatch = useDispatch();

     const {user,loading} =  useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)

    useEffect(()=>{
      onAuthStateChanged(auth,async(user)=>{
         if(user)
          {
             const data = await getUser(user.uid);
             dispatch(userExist(data.user));
          }
          else{
            dispatch(userNotExist());
          }
      })

    },[]);

  return loading ? <Loader/> : (
    <Router>
       <Header user={user}/>

    <Suspense fallback={<Loader/>}> <Routes>
       <Route path="/"element={<Home/>} / >
       <Route path="/Cart"element={<Cart/>} / >
       <Route path="/Search"element={<Search/>} / >
 
        {/* Not logged in route */}
         <Route path="/login" element={<ProtectedRoute 
          isAunthenticated={user ? false : true}>
          <Login/></ProtectedRoute>}></Route>

         {/* logged in users */}
         <Route element={<ProtectedRoute isAunthenticated={user ? true : false}/>}>
         <Route path="/Shipping"element={<Shipping/>} / >
         <Route path="/Orders"element={<Order/>} / >
         </Route>


         {/* Admin routes */}

          <Route
             element={
             <ProtectedRoute 
             isAunthenticated={true} 
             adminOnly={true}   
             admin={user?.role==="admin"? true : false} /> }> 

         <Route path="/admin/dashboard" element={<Dashboard />} />
         <Route path="/admin/product" element={<Products />} />
         <Route path="/admin/customer" element={<Customers />} />
         <Route path="/admin/transaction" element={<Transaction />} />

         {/* Charts */}
         <Route path="/admin/chart/bar" element={<Barcharts />} />
         <Route path="/admin/chart/pie" element={<Piecharts />} />
         <Route path="/admin/chart/line" element={<Linecharts />} />

         {/* Apps */}
         <Route path="/admin/app/coupon" element={<Coupon />} />
         <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
         <Route path="/admin/app/toss" element={<Toss />} />
 
         {/* Management */}
         <Route path="/admin/product/new" element={<NewProduct />} />
         <Route path="/admin/product/:id" element={<ProductManagement />} />
         <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
 
        </Route>; 
 
   </Routes>
   </Suspense>
   <Toaster position="bottom-center"/>
   </Router>
 
   );
};

export default App;
