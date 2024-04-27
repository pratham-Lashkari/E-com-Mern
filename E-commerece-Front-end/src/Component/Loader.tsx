
export default function Loader() {
  return (
    <div>
      <h1>Loader.............</h1>
    </div>
  )
};

export const Skeleton = () =>{

   return <div className="skeleton-loader">
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
   </div>
};
