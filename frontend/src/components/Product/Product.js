import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from '../Loader/Loader';
import ProductCard from './ProductCard';
import './Product.css';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Slider from '@mui/material/Slider';
import {  Typography } from '@mui/material';
import { useAlert } from 'react-alert';
import MetaData from '../MetaData';



const sliderStyles = {
    
    root: {
        color: '#571fc7', // Slider track color
    },
    thumb: {
        backgroundColor:'#571fc7',
        
        color: '#FFFFFF', // Slider thumb color
    },
    valueLabel: {
        backgroundColor:'#571fc7',
        color: '#FFFFFF', // Value label text color
    },
  
};


const categories=[
    "ULTRABOOST",
    "KAPTIR",
    "ZX",
    "NMD",
    "TERREX"

]

const Product = () => {
    const alert=useAlert()
    const { keyword } = useParams(); 
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 10000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState("");

    const { products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector(state => state.products);

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors())
        }
        dispatch(getProduct(keyword || "", currentPage, price,category,ratings)); 
    }, [dispatch, keyword, currentPage, price,category,ratings,alert,error]);
    

const handleCategoryClick = (category) => {
  setCategory(category);

};


    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    };

    if (loading) return <Loader />;

    return (
        <>
        <MetaData title="SoleSync-Products"/>
            <h2 className="productsHeading">Products</h2>
            <div className="ProductsWrapper">
                <div className="Products">
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <p>No products found for "{keyword || "search"}"</p>
                    )}
                </div>
            </div>
            <div className="filterBox">
                <Typography>Price</Typography>
                <Slider 
                    value={price} 
                    onChange={priceHandler} 
                    valueLabelDisplay="on" 
                    aria-labelledby="range-slider" 
                    min={0} 
                    max={10000}
                    sx={{
                        '& .MuiSlider-thumb': sliderStyles.thumb,
                        '& .MuiSlider-track': sliderStyles.root,
                        '& .MuiSlider-rail': sliderStyles.root,
                        '& .MuiSlider-valueLabel': sliderStyles.valueLabel,
                    }}
                />

<Typography className="categoriesTypography">
                Categories
               </Typography>
               <ul className="categoryBox">
                {categories.map((category)=>(
                    <li
                    className="category-link"
                    key={category}
                    onClick={()=>handleCategoryClick(category)}

                    >
                       {category}
                    </li>
                ))}
               </ul>
               <fieldset>
                <Typography >Ratings Above</Typography>
                <Slider
    value={ratings}
    onChange={(event, newValue) => {
        setRatings(newValue);
    }}
    aria-labelledby="ratings-slider"
    min={0}
    max={5}
    valueLabelDisplay="auto"
    sx={{
        '& .MuiSlider-thumb': sliderStyles.thumb,
        '& .MuiSlider-track': sliderStyles.root,
        '& .MuiSlider-rail': sliderStyles.root,
        '& .MuiSlider-valueLabel': sliderStyles.valueLabel,
    }}
/>   
                       
               </fieldset>
            </div>
           


            {filteredProductsCount >resultPerPage && (
  <div className="paginationBox">
    <Pagination
      activePage={currentPage}
      itemsCountPerPage={resultPerPage}
      totalItemsCount={filteredProductsCount}
      onChange={setCurrentPageNo}
      nextPageText="Next"
      prevPageText="Prev"
      firstPageText="1st"
      lastPageText="Last"
      itemClass="page-item"
      linkClass="page-link"
      activeClass="pageItemActive"
      activeLinkClass="pageLinkActive"
    />
  </div>
)}
        </>
    );
};

export default Product;
