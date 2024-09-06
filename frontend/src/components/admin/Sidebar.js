import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation import
import logo from '../../assets/Black Cream Minimalist Monogram Initial Logo (1).png';
import "./sidebar.css";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PostAddIcon from "@material-ui/icons/PostAdd";
import AddIcon from "@material-ui/icons/Add";
import ListAltIcon from "@material-ui/icons/ListAlt";
import PeopleIcon from "@material-ui/icons/People";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const Sidebar = () => {
  const [showProducts, setShowProducts] = useState(false);
  const location = useLocation(); // Use location for checking current route

  const handleToggleProducts = () => {
    setShowProducts(!showProducts);
  };

  // Check if the current route is for admin products
  const isAdminProductRoute = location.pathname.startsWith('/admin/products');

  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="SoleSync" />
      </Link>

      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>

      <ul>
        <li>
          <p>
            <Link to="#" className="dropdown-link" onClick={handleToggleProducts}>
              Products <ArrowDropDownIcon />
            </Link>
          </p>
          {showProducts && (
            <ul className={`dropdown-menu ${showProducts ? 'show' : ''}`}>
              <li>
                {/* If already on the admin products route, stay on current page */}
                <Link to={isAdminProductRoute ? location.pathname : '/admin/products'}>
                  <PostAddIcon /> All
                </Link>
              </li>
              <li>
                {/* If already on the admin products route, append /create, otherwise go to create product */}
                <Link to={isAdminProductRoute ? `${location.pathname}/create` : '/admin/product'}>
                  <AddIcon /> Create
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/admin/orders">
            <ListAltIcon /> Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/users">
            <PeopleIcon /> Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
