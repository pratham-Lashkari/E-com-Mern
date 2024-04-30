import { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'


interface Props{
  children?:ReactElement,
  isAunthenticated : boolean,
  adminOnly?:boolean,
  admin? : boolean,
  redirect? : string
}
function ProtectedRoute({
  isAunthenticated, 
  adminOnly, 
  children, 
  redirect="/", 
  admin
}:Props) {
  
  if (!isAunthenticated) return <Navigate to={redirect} />;

  if (adminOnly && !admin) return <Navigate to={redirect} />;
   return children? children:<Outlet/>;
};

export default ProtectedRoute
