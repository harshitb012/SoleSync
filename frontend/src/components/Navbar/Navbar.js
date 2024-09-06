import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Black Cream Minimalist Monogram Initial Logo (1).png';
import search from '../../assets/search-w.png';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const alert = useAlert();
    const { isAuthenticated } = useSelector(state => state.user); // Get the authentication status from Redux

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products/${keyword}`);
        } else {
            navigate("/products");
        }
    };

    const logoutUser = async () => {
        try {
            dispatch(logout());
            alert.success("Logout Successfully");
            navigate('/login'); 
        } catch (error) {
            alert.error("Logout failed. Please try again.");
        }
    };

    const handleProfileClick = () => {
        if (isAuthenticated) {
            navigate('/account');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <nav className="socials-nav">
                <div className="nav-margin-util">
                    Free delivery for all orders above ₹1500.
                </div>
            </nav>
            
            <div className="navbar">
                <div className="nav-logo">
                    <img src={logo} alt="Shop Logo" />
                </div>

                <ul className="nav-menu">
                    <li><a href="/home">Home</a></li>
                    <li><a href="/products">Shop</a></li>
                    <li><a href="/products">Products</a></li>
                </ul>

                <div className="nav-search-container">
                    <form onSubmit={searchSubmitHandler} id="searchForm">
                        <input 
                            type="text" 
                            id="searchBox" 
                            placeholder="Search" 
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit" id="searchBtn">
                            <img src={search} alt="Search Icon" />
                        </button>
                    </form>
                </div>

                <div className="nav-login-cart">
                    <button id="logoutBtn" onClick={logoutUser}>Logout</button>
                    <Link to="/cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                            <path d="M1.58984 11.2148H18.5084L20.9998 3.08951H1.58984V11.2148Z" fill="currentColor"></path>
                            <path d="M3.57402 11.2148H1.58984V12.9795H3.57402V11.2148Z" fill="currentColor"></path>
                            <path d="M1.58984 12.8027V14.5704H17.4769L18.0184 12.8027H1.58984Z" fill="currentColor"></path>
                            <path d="M5.36335 17.6608C5.36335 18.5873 4.51691 19.3371 3.47171 19.3371C2.4265 19.3371 1.58691 18.5873 1.58691 17.6608C1.58691 16.7343 2.42993 15.9846 3.47171 15.9846C4.51348 15.9846 5.36335 16.7343 5.36335 17.6608Z" fill="currentColor"></path>
                            <path d="M15.4893 17.6608C15.4893 18.5873 14.6463 19.3371 13.6011 19.3371C12.5559 19.3371 11.7129 18.5873 11.7129 17.6608C11.7129 16.7343 12.5593 15.9846 13.6011 15.9846C14.6429 15.9846 15.4893 16.7343 15.4893 17.6608Z" fill="currentColor"></path>
                            <path d="M1.78541 0.968262C0.801893 0.968262 0 1.68144 0 2.55614C0 3.43085 0.801893 4.14707 1.78541 4.14707C2.76893 4.14707 3.57425 3.43694 3.57425 2.55614C3.57425 1.67534 2.77578 0.968262 1.78541 0.968262ZM1.78541 3.05293C1.48042 3.05293 1.23025 2.83349 1.23025 2.55614C1.23025 2.2788 1.48042 2.06241 1.78541 2.06241C2.0904 2.06241 2.34399 2.28489 2.34399 2.55614C2.34399 2.82739 2.09383 3.05293 1.78541 3.05293Z" fill="currentColor"></path>
                        </svg>
                    </Link>
                    <CgProfile
                        style={{
                            fontSize: '30px',  // Increase the size
                            color: '#000',  // Default color
                            cursor: 'pointer'  // Add cursor pointer
                        }}
                        onClick={handleProfileClick}  // Handle click event
                        onMouseOver={(e) => e.currentTarget.style.color = '#571f7c'}  // Change color on hover
                        onMouseOut={(e) => e.currentTarget.style.color = '#000'}  // Revert color on mouse out
                    />
                </div>
            </div>
        </>
    );
};

export default Navbar;
