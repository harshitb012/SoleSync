const   Order=require('../models/orderModel')
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const asyncError = require("../middleware/asyncerror");


//create new order
exports.newOrder=asyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body;
    const order=await Order.create({
        shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,
        paidAt:Date.now(),user:req.user._id,
    })
    res.status(201).json({
        success:true,
        order
    })
})

//get single order
exports.getSingleOrder=asyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name,email")
    if(!order){
        return next(new ErrorHandler("order not found with this id ",404))
    }
    res.status(201).json({
        success:true,
        order
    })
})
//get logged in user order
exports.myOrders=asyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id})
    res.status(201).json({
        success:true,
        orders
    })
})
//get all  order-Admin
exports.getAllOrders=asyncError(async(req,res,next)=>{
    const orders=await Order.find()

    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    res.status(201).json({
        success:true,
        totalAmount,
        orders
    })
})
//Update order Status-Admin
exports.updateOrder=asyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler("order not found with this id ",404))
    }
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have delivered this order",404))
    }
     order.orderItems.forEach(async (o)=>{
        await updateStock(o.product,o.quantity)
     })

     order.orderStatus=req.body.status;
     if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now()
     }
      
     await order.save({validateBeforeSave:false})
     res.status(201).json({
        success:true,
        order
    })
})

async function updateStock(id,quantity){
    const product=await Product.findById(id)
    if (!product) {
        console.error(`Product with ID ${id} not found.`);
        return;
    } 
    product.stock-=quantity
    product.save({validateBeforeSave:false})
}
//Delete Order- Admin
exports.deleteOrder=asyncError(async(req,res,next)=>{
    const order=await Order.findByIdAndDelete(req.params.id)
     if(!order){
        return next(new ErrorHandler("order not found with this id ",404))
    }

    res.status(201).json({
        success:true,
        totalAmount,
        order
    })
})