const express = require('express');
const { validationResult } = require('express-validator');
const lodash = require('lodash');
const fs = require('fs');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: './variables.env' });
const configs = require('../config/configs').configs;

const favouriteService = require('../services/favouriteService');
const wishlistService = require('../services/wishlistService');
const upload = require('../middlewares/upload');
const logger = require('../middlewares/logger');
const umg = require('../middlewares/umg');

exports.getFavouriteContacts=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
        try {
            let uuid = req.body.uuid;
            const favouriteContacts = await favouriteService.findByUserId(uuid);
            if(favouriteContacts.length>0){
                await logger.log('info', "user management module" , {type: "getFavouriteContacts", uuid: uuid, tags: 'favourite contacts'});
                res.status(200).json({ status_code: 200, status: 'success', data: favouriteContacts });
            }else{
                res.status(200).json({ status_code: 405, status: 'failure', message: 'user favourite contacts not found.' });    
            }
        } catch (err) {
            res.status(500).json({ status_code: 500, status: 'failure', message: err });
        }
    }
}

exports.createFavouriteContact=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
        try {
            var inputData = req.body;
            const uuid = inputData.uuid;
            const name = inputData.favName;
            const nickname = inputData.favNickname;
            const relation = inputData.favRelation;
            const email = inputData.favEmail;
            const sex = inputData.favSex;
            const mobile = inputData.favMobile;
            const occasion = inputData.favOccasion;
            const profile_image = inputData.favProfileImage;
            const contact_access_to_wishlist = inputData.favAccessToWishlist;
            const source = inputData.source;
            const source_id = inputData.sourceId;

            const favouriteContact = {
                uuid: uuid,
                contact_name: name,
                contact_nickname: nickname,
                contact_relation: relation,
                contact_email: email,
                contact_sex: sex,
                contact_mobile: mobile,
                contact_occasion: occasion,
                contact_profile_image: profile_image,
                contact_access_to_wishlist: contact_access_to_wishlist,
                contact_source: source,
                contact_source_id: source_id
            };
            
            const favouriteContactToCreate = lodash.omitBy(favouriteContact, function(v) { return lodash.isUndefined(v) || lodash.isNull(v); })
            const checkIfContactExist = await favouriteService.checkIfContactExist(uuid, mobile);
            if(checkIfContactExist.length>0){
                return res.status(200).json({ status_code: 405, status: 'failure', message: 'contact already exist' });
            }else{
                let favouriteContactsCount = await favouriteService.getUserContactsCount(uuid);
                if(favouriteContactsCount >= configs.favourite_contacts_limit ){
                    return res.status(200).json({ status_code: 405, status: 'failure', message: 'contact limit exceeded' });    
                }
                let createContact = await favouriteService.createFavouriteContact(favouriteContactToCreate);
                if(createContact){
                    return res.status(200).json({ status_code: 200, status: 'success', message: 'favourite contact created' });    
                }else{
                    return res.status(200).json({ status_code: 410, status: 'failure', message: 'failed to add contact' });    
                }                        
            }
        } catch (err) {
            return res.status(500).json({ status_code: 500, status: 'failure', message: err });
        }
    }
}

exports.editFavouriteContact=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
        try {
            var inputData = req.body;
            const uuid = inputData.uuid;
            const name = inputData.favName;
            const nickname = inputData.favNickname;
            const relation = inputData.favRelation;
            const email = inputData.favEmail;
            const sex = inputData.favSex;
            const mobile = inputData.favMobile;
            const occasion = inputData.favOccasion;
            const profile_image = inputData.favProfileImage;
            const contact_access_to_wishlist = inputData.favAccessToWishlist;
            const source = inputData.source;
            const source_id = inputData.sourceId;
            const contact_id = inputData.favContactId;

            const favouriteContact = {
                contact_name: name,
                contact_nickname: nickname,
                contact_relation: relation,
                contact_email: email,
                contact_sex: sex,
                contact_mobile: mobile,
                contact_occasion: occasion,
                contact_profile_image: profile_image,
                contact_access_to_wishlist: contact_access_to_wishlist,
                contact_source: source,
                contact_source_id: source_id
            };
            const favouriteContactToUpdate = lodash.omitBy(favouriteContact, function(v) { return lodash.isUndefined(v) || lodash.isNull(v); })

            let findFavouriteContactById = await favouriteService.findByUserId(uuid);
            if(findFavouriteContactById){
                let checkIfMobileNumberExist = await favouriteService.checkIfContactExist(uuid, mobile);
                if(checkIfMobileNumberExist.length>0){
                    if(checkIfMobileNumberExist[0]._id.toString() != contact_id){
                        return res.status(200).json({ status_code: 410, status: 'failure', message: 'mobile number already exist' });    
                    }                    
                }
                let updateContact = await favouriteService.updateFavouriteContactByUuid(uuid, favouriteContactToUpdate);
                if(updateContact){
                    return res.status(200).json({ status_code: 200, status: 'success', message: 'favourite contact updated' });
                }else{
                    return res.status(200).json({ status_code: 410, status: 'failure', message: 'failed to update contact' });
                }                    
            }
        } catch (err) {
            return res.status(500).json({ status_code: 500, status: 'failure', message: err });
        }
    }
}

exports.removeFavouriteContact=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
        try {
            let contact_id = req.body.favContactId;
            const favouriteContact = await favouriteService.findById(contact_id);
            if(favouriteContact.length>0){
                let removeContact = await favouriteService.deleteContact(contact_id)

                if(removeContact.n == 1){
                    res.status(200).json({ status_code: 200, status: 'success', message: 'contact removed successfully.' });
                }else{
                    res.status(200).json({ status_code: 410, status: 'failure', message: 'failed to remove contact for the user.' });
                }
            }else{
                res.status(200).json({ status_code: 405, status: 'failure', message: 'invalid contact.' });    
            }
        } catch (err) {
            res.status(500).json({ status_code: 500, status: 'failure', message: err });
        }
    }
}

exports.uploadImage=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
      try {
        const filename = req.body.filename;
        const preSignUrl = await upload.getPreSignUrl(filename, configs.s3_buckets.favourite_contact);
        res.status(200).json({ status_code: 200, status: 'success', response: preSignUrl.body });
      } catch (err) {
        console.log(err.stack);  
        res.status(200).json({ status_code: 500, status: 'failure', message: err.message });
      }

    }
}


exports.favouritesWishlist=async(req,res)=>{
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ status_code: 400, status: 'failure', message: errors.array() })
    } else {
      try {
        const uuid = req.body.uuid;

        const privateKeyUsrMgmt = fs.readFileSync('private_usrmgmt.key');

        let date = new Date(g);
        let issueDate = Math.round(date.getTime() / 1000);

        // Expire at end of the day.
        //date.setFullYear(date.getFullYear() + 3);
        date.setHours(23, 59, 59, 999);
        let expiryDate = Math.round((date.getTime()) / 1000);

        var token = await jwt.sign({
            "aud": "",
            "jti": "",
            "iat": issueDate,
            "nbf": issueDate,
            "exp": expiryDate,
            "sub": uuid,
            "scopes": "",
            "iss": "http://dev-umg.giftiicon.com/api",
            "scope": "consumer"
        }, privateKeyUsrMgmt, { algorithm: 'RS256' });

        const favouriteContacts = await favouriteService.findByUserId(uuid);
        if(favouriteContacts.length>0){
            const favouriteContactsMobileArray = lodash.map(favouriteContacts, 'contact_mobile');
            const favouriteContactsUuids = await umg.getUuidsFromMobile(uuid, favouriteContactsMobileArray, token);
            let registeredUsers = [];
            let registeredUsersDetail = [];
            for (const [mobile, uuid] of Object.entries(favouriteContactsUuids)) {
              if(uuid != "Not Registered"){
                  registeredUsers.push(uuid);
                  registeredUsersDetail.push({mobile: mobile, uuid: uuid});
              }
            }
            let wishlistOfFavouriteContacts = await wishlistService.getWishlistByUuids(registeredUsers);
            if(wishlistOfFavouriteContacts.length>0){
                for(var i=0; i<wishlistOfFavouriteContacts.length; i++){
                    let favouriteContactDetails = await favouriteService.findByMobile(registeredUsersDetail[i].mobile);
                    wishlistOfFavouriteContacts[i].contact_mobile = registeredUsersDetail[i].mobile;
                    wishlistOfFavouriteContacts[i].contact_name = favouriteContactDetails.contact_name;
                }
                res.status(200).json({ status_code: 200, status: 'success', response: wishlistOfFavouriteContacts });
            }else{
                res.status(200).json({ status_code: 410, status: 'failure', message: 'no products found.' });
            }  
        }else{
            res.status(200).json({ status_code: 405, status: 'failure', message: 'user favourite contacts not found.' });    
        }        

      } catch (err) {
        console.log(err.stack);  
        res.status(200).json({ status_code: 500, status: 'failure', message: err.message });
      }

    }
}

