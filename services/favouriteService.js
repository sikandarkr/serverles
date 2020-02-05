const Favourite = require('../models/Favourites');
const mongoose = require('mongoose');

exports.findByUserId=async(uuid)=>{
    return await Favourite.find({"uuid": uuid}).lean();
}

// exports.checkFavouriteContact=async(uuid, mobile)=>{
//     return await Favourite.find({"uuid": uuid, "contacts.mobile": mobile}).lean();
// }

exports.checkFavouriteContact=async(uuid, mobile)=>{
    return await Favourite.find({"uuid": uuid, "contacts.mobile": mobile}, {'contacts.$' : 1}).lean();
}

exports.addFavouriteContact=async(uuid, favouriteContact)=>{
    return await Favourite.updateOne({"uuid": uuid}, { $push: {contacts: favouriteContact} }, { upsert: true });
}

exports.updateFavouriteContact=async(id, favouriteContact)=>{
    return await Favourite.updateOne({'contacts._id': id}, { $set: favouriteContact }, { upsert: false });
}

exports.removeContact=async(uuid, mobile)=>{
    return await Favourite.updateOne({"uuid": uuid}, { $pull: {'contacts': mobile} }, {safe: true});
}

// new version
exports.getUserContactsCount=async(uuid)=>{
    return await Favourite.count({"uuid": uuid});
}

exports.checkIfContactExist=async(uuid, mobile)=>{
    return await Favourite.find({"uuid": uuid, "contact_mobile": mobile}).lean();
}

exports.createFavouriteContact=async(favouriteContact)=>{
    return await Favourite.create(favouriteContact);
}

exports.updateFavouriteContactByUuid=async(uuid, favouriteContact)=>{
    return await Favourite.updateOne({'uuid': uuid}, { $set: favouriteContact }, { upsert: false });
}

exports.deleteContact=async(id)=>{
    return await Favourite.deleteOne({"_id": id});
}

exports.findById=async(id)=>{
    return await Favourite.find({"_id": id}).lean();
}

exports.findByMobile=async(mobile)=>{
    return await Favourite.findOne({"contact_mobile": mobile}).lean();
}



