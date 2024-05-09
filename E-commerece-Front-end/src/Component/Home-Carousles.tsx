import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import freeDeliver from "../assets/Carousels/freeDelivery.jpg"
import headPhone from "../assets/Carousels/headphone.jpeg"
import homeDecor from "../assets/Carousels/homedecory.jpg"
import iphone from "../assets/Carousels/iphone.avif"
import multiple from "../assets/Carousels/multiple.png"
import sports from "../assets/Carousels/sports.png"


const Carousels = () => {
  return (
    <Carousel className='carousles'>
        <div>
            <img src={freeDeliver} />
        </div>
        <div>
            <img src={headPhone} />
        </div>
        <div>
            <img src={homeDecor} />
        </div>
        <div>
            <img src={iphone} />
        </div>
        <div>
            <img src={multiple} />
        </div>
        <div>
            <img src={sports} />
        </div>
    </Carousel>
);
}

export default Carousels;