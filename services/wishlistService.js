const Wishlist = require('../models/Wishlist');
const mongoose = require('mongoose');

exports.findByUserId=async(uuid)=>{
    return await Wishlist.findOne({uuid: uuid}).lean();
}

exports.checkIfProductExistInWishlist=async(uuid, productId)=>{
    return await Wishlist.find({"uuid": uuid, "products.id": productId}).lean();
}

// exports.checkFavouriteContact=async(mobile)=>{
//     return await Favourite.find({"contacts.mobile": mobile}, {'contacts.$' : 1}).lean();
// }

exports.addProductToWishlist=async(uuid, product)=>{
    return await Wishlist.updateOne({uuid: uuid}, { $push: {products: product} }, { upsert: true });
}

exports.removeProduct=async(uuid, product)=>{
    return await Wishlist.updateOne({uuid: uuid}, { $pull: {'products': product} }, {safe: true});
}

exports.getWishlistByUuids=async(uuids)=>{
    return await Wishlist.find({uuid: {$in: uuids}})
    .select('products uuid')
    .lean();
}
