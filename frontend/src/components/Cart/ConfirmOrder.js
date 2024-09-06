import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import MetaData from '../MetaData';
import { Link, useNavigate } from 'react-router-dom';
import './ConfirmOrder.css';
import CheckOutStep from './CheckOutStep';

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user ,isAuthenticated} = useSelector((state) => state.user);
  console.log("User Data:", user);
console.log("Is Authenticated:", isAuthenticated);
  const navigate=useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;

  const address = shippingInfo
    ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.phoneNo}`
    : 'Address not available';

    const proceedToPayment=()=>{
        const data={
            subtotal,
            shippingCharges,
            tax,
            totalPrice,
        }
        sessionStorage.setItem("orderInfo",JSON.stringify(data));

        navigate("/process/payment")
    }


  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckOutStep activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <h2>Shipping Info</h2>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user ? user.name : 'User not logged in'}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo ? shippingInfo.phoneNo : 'Phone not available'}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <h2>Your Cart Items:</h2>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <div className="orderSummary">
            <h2>Order Summary</h2>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
