import { BrowserRouter as Router , Routes , Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import Loader from "./Component/Loader"
const Home  = lazy(()=>import("./pages/Home"))  
const Cart  = lazy(()=>import("./pages/Cart"))  
const Search  = lazy(()=>import("./pages/Search"))  
function App() {

  return (
   <Router>
   <Suspense fallback={<Loader/>}> <Routes>
      <Route path="/"element={<Home/>} / >
      <Route path="/Cart"element={<Cart/>} / >
      <Route path="/Search"element={<Search/>} / >
    </Routes>
    </Suspense>
   </Router>
  )
}

export default App
