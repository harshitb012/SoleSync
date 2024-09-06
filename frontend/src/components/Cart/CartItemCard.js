import React from 'react';
import './CartItemCard.css';
import { Link } from 'react-router-dom';

const CartItemCard = ({ item ,deleteCartItems}) => {
    console.log("item image" ,item.image)
  return (
    <div className="CartItemCard">
    <img src={`${item.image}`} alt="ssa" />
    <div>
    
      <div className="item-details">
        <span>{item.name}</span>
        <span>{`Price: ₹${item.price}`}</span>
        <p onClick={()=>deleteCartItems(item.product)}>Remove</p>
      </div>
      </div>
      </div>
  );
};

export default CartItemCard;
