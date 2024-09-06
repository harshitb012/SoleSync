import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import { loadUser } from './actions/userAction';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import ProductDetails from './components/Product/ProductDetail';
import Product from './components/Product/Product';
import LoginSignup from './components/User/LoginSignup';
import ProtectedRoute from './Route/ProtectedRoute';
import UserProfile from './components/User/UserProfile';
import UpdateProfile from './components/User/UpdateProfile';
import UpdatePassword from './components/User/UpdatePassword';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/Shipping';
import ConfirmOrder from './components/Cart/ConfirmOrder';
import Payment from './components/Cart/Payment';
import './App.css';
import axios from 'axios';
import store from './store';
import { Elements, } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/Cart/OrderSuccess'
import MyOrders from './components/Orders/MyOrders';
import OrderDetails from './components/Orders/OrderDetails';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';

const isOrderDetailsPage = (pathname) => /^\/order\/[a-zA-Z0-9]+$/.test(pathname);

const NavBarWrapper = ({ children }) => {
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname === '/login' ||
    location.pathname === '/me/update' ||
    location.pathname === '/password/update' ||
    location.pathname === '/password/forgot' ||
    location.pathname === '/cart' ||
    location.pathname === '/shipping' ||
    location.pathname === '/order/confirm' ||
    location.pathname==='/process/payment' ||
    location.pathname==='/success'||
    location.pathname==='/orders'||
    location.pathname==='/admin/dashboard'||
    location.pathname==='/admin/products' ||
    location.pathname==='/admin/product';

    isOrderDetailsPage(location.pathname);

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      {children}
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const fetchStripeApiKey = async () => {
      try {
        const { data } = await axios.get('/api/v1/stripeapikey');
        setStripeApiKey(data.stripeApiKey);
        setStripe(loadStripe(data.stripeApiKey));
      } catch (error) {
        console.error("Failed to fetch Stripe API key", error);
      }
    };

    fetchStripeApiKey();
    dispatch(loadUser());
  }, [dispatch]);

  // if (loading || !stripe) {
  //   return <div>Loading...</div>;
  // }

  return (
    <Router>
      <NavBarWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:keyword" element={<Product />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/account" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
          <Route path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
          <Route path="/order/confirm" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
          <Route path="/process/payment" element={
            stripe ? (
              <Elements stripe={stripe}>
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              </Elements>
            ) : (
              <div>Loading...</div>
            )
          } />
          <Route path="/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><MyOrders/></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetails/></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute adminRoute={true}><Dashboard/></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute adminRoute={true}><ProductList/></ProtectedRoute>} />
          <Route path="/admin/product" element={<ProtectedRoute adminRoute={true}><NewProduct/></ProtectedRoute>} />
        </Routes>
      </NavBarWrapper>
    </Router>
  );
}

export default App;