import React, { useEffect, useState } from 'react';
import './Home.css';
import Product from '../Product/ProductCard';
import MetaData from '../MetaData';
import { getProduct } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../Loader/Loader';
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector(state => state.products);

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      img: "https://huge-shoes.myshopify.com/cdn/shop/files/shoe7.jpg?v=1613156880",
      heading: "Zen Vivid 15",
      info: "The Best Sellers from ₹500",
      link: "/products"
    },
    {
      img: "https://huge-shoes.myshopify.com/cdn/shop/files/shoe9.jpg?v=1613156880",
      heading: "From The Summer",
      info: "Step into summer with our latest collection! Featuring lightweight materials and breathable designs, these shoes offer ultimate comfort and style. Perfect for sunny days and warm adventures ",
      link: "/products"
    }
   
  ];

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="SoleSync" />

          <div className="slider-container">
            {slides.map((slide, index) => (
              <div
                className={`slider-slide ${index === currentSlide ? "active" : ""}`}
                key={index}
              >
                <div className="slider-img">
                  <img src={slide.img} alt={`Slide ${index + 1}`} />
                </div>
                <div className={`slider-content ${index === 0 ? 'content-left' : index === 1 ? 'content-right' : 'content-top'}`}>
                  <div className="slider-heading">
                    <h1>{slide.heading}</h1>
                  </div>
                  <div className="slider-info">
                    {slide.info}
                  </div>
                  <a href={slide.link} className="slider-button">Shop Now</a> {/* Add button here */}
                </div>
              </div>
            ))}
            <button className="prev" onClick={prevSlide}>&#10094;</button>
            <button className="next" onClick={nextSlide}>&#10095;</button>
          </div>

          <div className="slider-pagination">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>

          <div className="container" id="container">
            {products && products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
