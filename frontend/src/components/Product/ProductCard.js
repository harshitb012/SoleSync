import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    isHalf: true,
    value: product.ratings
  };

  const imageUrl = product.img || (product.images && product.images[0] ? product.images[0].url : '');

  return (
    <Link className='productCard' to={`/product/${product._id}`}>
      <img src={imageUrl} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} />{" "}
        {/* <span className='reviews'>({product.numofReviews } Reviews)</span> */}
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
