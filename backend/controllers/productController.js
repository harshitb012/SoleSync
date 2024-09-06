const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const asyncError = require("../middleware/asyncerror");
const FeaturesApi = require("../utils/featuresapi");
const cloudinary=require('cloudinary');



// Create product - admin
exports.createProduct = asyncError(async (req, res, next) => {
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
  
    const product = await Product.create(req.body);
  
    res.status(201).json({
      success: true,
      product,
    });
  });
// Get all products
exports.getAllProducts = asyncError(async (req, res, next) => {
    try {
        const resultPerPage = 8;
        const productsCount = await Product.countDocuments();

 
        // const featuresApi = new FeaturesApi(Product.find(), req.query).search().filter();
        const featuresApi = new FeaturesApi(Product.find(), req.query).search().filter();
    
        featuresApi.pagination(resultPerPage);


        let products = await featuresApi.query;
        let filteredProductsCount = await Product.countDocuments(featuresApi.query.getFilter());

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for the given search criteria.",
                products: []
            });
        }

        res.status(200).json({
            success: true,
            products,
            productsCount,
            resultPerPage,
            filteredProductsCount,
        });
    } catch (error) {
        console.error("Error in getAllProducts:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//Get All Products(Admin)
exports.getAdminProducts = asyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

// Get product details
exports.getProductDetails = asyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});

// Update product - admin
exports.updateProduct = asyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// Delete product
exports.deleteProduct = asyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});

  // Create new review or update the review
exports.createProductReview = asyncError(async (req, res, next) => {
    const { rating, comment, productID } = req.body;
    console.log('Received review data:', req.body);

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productID);
    if (!product) {
        console.log('Product not found');
        return next(new ErrorHandler("Product not found", 404));
    }

    console.log('Product found:', product);

    const isReviewed = product.reviews.find(
        rev => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
        console.log('Review updated');
    } else {
        product.reviews.push(review);
        product.numofReviews = product.reviews.length;
        console.log('Review added');
    }

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    console.log('Product saved with updated reviews:', product);

    res.status(200).json({
        success: true,
    });
});

// Get all Reviews of product
exports.getProductReviews = asyncError(async (req, res, next) => {
    const productId = req.query.id;
    if (!productId) {
        return next(new ErrorHandler("Product ID is required", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});
// Delete Review
exports.deleteReviews = asyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating;
    });

    const ratings = reviews.length === 0 ? 0 : avg / reviews.length;
    const numofReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productID, { reviews, ratings, numofReviews }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        reviews,
    });
});
