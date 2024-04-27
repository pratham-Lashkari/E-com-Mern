import { SkeletonProps } from "../types/types";

export default function Loader() {
  return (
    <div>
      <h1>Loader.............</h1>
    </div>
  )
};

export const Skeleton = ({width = "unset" , length = 3}:SkeletonProps) =>{

    const skeletons =  Array.from({length} , (v,idx)=>(
      <div key={idx} className="skeleton-shape"></div>
    ))
   return <div className="skeleton-loader" style={{width}}>
      {skeletons}
   </div>
};
