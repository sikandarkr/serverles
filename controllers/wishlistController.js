const express = require('express');
require('dotenv').config({ path: './variables.env' });
const configs = require('../config/configs').configs;

const { validationResult } = require('express-validator');
const lodash = require('lodash');

const wishlistService = require('../services/wishlistService');

const logger = require('../middlewares/logger');

exports.getOwnWishlist=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
        try {
            let uuid = req.body.uuid;
            const wishlist = await wishlistService.findByUserId(uuid);
            if(wishlist){
                if(wishlist.products.length>0){
                    res.status(200).json({ status_code: 200, status: 'success', data: wishlist });
                }else{
                    res.status(200).json({ status_code: 405, status: 'failure', message: 'No products in wishlist.' });
                }
            }else{
                res.status(200).json({ status_code: 410, status: 'failure', message: 'user wishlist not found.' });
            }
        } catch (err) {
            res.status(500).json({ status_code: 500, status: 'failure', message: err });
        }
    }
}

exports.addToWishList=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
        try {
            var inputData = req.body;
            const uuid = inputData.uuid;
            const id = inputData.productId;

            const product = {
                id: id
            };

            const checkIfProductExist = await wishlistService.checkIfProductExistInWishlist(uuid, id);
            if(checkIfProductExist.length>0){
                res.status(200).json({ status_code: 405, status: 'failure', message: 'product already exist' });
            }else{
                let findWishlistById = await wishlistService.findByUserId(uuid);
                if(findWishlistById){
                    if(findWishlistById.products.length >= configs.wishlist_products_limit ){
                        res.status(200).json({ status_code: 405, status: 'failure', message: 'Products in wishlist limit exceeded' });    
                    }
                }
                let addToWishlist = await wishlistService.addProductToWishlist(uuid, product);
                if(addToWishlist){
                    res.status(200).json({ status_code: 200, status: 'success', message: 'product added to wishlist' });    
                }else{
                    res.status(200).json({ status_code: 410, status: 'failure', message: 'failed to add wishlist' });    
                }                        
            }
        } catch (err) {
            res.status(500).json({ status_code: 500, status: 'failure', message: err });
        }
    }
}

exports.removeFromWishList=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
        try {
            let uuid = req.body.uuid;
            let productId = req.body.productId;
            const wishlist = await wishlistService.findByUserId(uuid);
            if(wishlist){
                let idOfProduct = lodash.find(wishlist.products, function(product) { return product.id == productId; });
                if(idOfProduct){
                    let removeProductFromWishlist = await wishlistService.removeProduct(uuid, idOfProduct)
                    if(removeProductFromWishlist.n == 1){
                        res.status(200).json({ status_code: 200, status: 'success', message: 'product removed successfully.' });
                    }else{
                        res.status(200).json({ status_code: 410, status: 'failure', message: 'failed to remove product from the wishlist.' });
                    }                
                }else{
                    res.status(200).json({ status_code: 405, status: 'failure', message: 'product not found.' });
                }
            }else{
                res.status(200).json({ status_code: 405, status: 'failure', message: 'user wishlist not found.' });    
            }
        } catch (err) {
            res.status(500).json({ status_code: 500, status: 'failure', message: err });
        }
    }
}