import React, { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { getProductDetails, clearErrors } from '../../actions/productAction';
import './ProductDetail.css';
import ReactStars from 'react-rating-stars-component';
import { useAlert } from 'react-alert';
import ReviewCard from './ReviewCard';
import MetaData from '../MetaData';
import { addItemsToCart } from '../../actions/cartAction';

const ProductDetail = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const alert = useAlert();
  const [quantity, setQuantity] = useState(1);
  const { product, loading, error } = useSelector((state) => state.productDetails);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert]);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  if (!product) {
    return <div>No product found</div>;
  }

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 20 : 25,
    isHalf: true,
    value: product.ratings,
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const addtoCartHandler = () => {
    dispatch(addItemsToCart(id, quantity)); // Use id from useParams
    alert.success("Items Added To Cart Successfully");
  };

  return (
    <Fragment>
      <MetaData title={`${product.name}--SoleSync`} />
      <div className="ProductDetails">
        <div>
          {product.img ? (
            <img className="ProductImage" src={product.img} alt="ProImage" />
          ) : (
            <div>No image available</div>
          )}
        </div>
        <div>
          <div className="detailsBlock-1">
            <h2>{product.name}</h2>
            <p>Product # {product._id}</p>
          </div>
          <div className="detailsBlock-2">
            <ReactStars {...options} />
            <span className="detailsBlock-2-span">
              ({product.numofReviews} Reviews)
            </span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹${product.price}`}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button onClick={decreaseQuantity}>-</button>
                <input
                  type="number"
                  readOnly
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))} // Convert to number
                />
                <button onClick={increaseQuantity}>+</button>
              </div>
              <button disabled={product.Stock<1?true:false} onClick={addtoCartHandler}>
                Add to Cart
              </button>
            </div>
            <p>
              Status:
              <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                {product.stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
          </div>
          <div className="detailsBlock-4">
            Description: <p>{product.description}</p>
          </div>
          <button className="submitReview">
            Submit Review
          </button>
        </div>
      </div>
      <h3 className="reviewsHeading">REVIEWS</h3>
      {product.reviews && product.reviews.length > 0 ? (
        <div className="reviews">
          {product.reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <p className="noReview">No Reviews Yet</p>
      )}
    </Fragment>
  );
};

export default ProductDetail;
