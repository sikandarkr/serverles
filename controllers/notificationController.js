var OneSignal = require('onesignal-node');
var PlayerIdModel = require('../models/PlayerIds');
var notificationHandler = require('../utils/notification_handler');
var validUrl = require('../validators/urlValidation');
module.exports =
{
  createPlayerIds:async(req,res,next)=>{

    const { uuid, player_id} = req.body
    console.log("your client data is ", req.body);
    if (uuid && player_id) { 
          const userExist = await PlayerIdModel.findOne({$or: [
            {uuid: uuid}
          ]});
          if(userExist){
                PlayerIdModel.update({uuid: uuid}, {
                  player_id: player_id, 
              }, function(err, numberAffected, rawResponse) {
                  if(!err){
                    return res.status(200).json({statusCode:200, status:true,message:"player_id updated successfully"});
                  }
                  else{
                    return res.status(500).json({statusCode:500, status:true,message:"Internal Server Error"});
                  }
              })
          }
        else{
            const user = new PlayerIdModel({
              player_id,
              uuid
            });
            await user.save(function(err,data) {
              if(err){
                return res.status(500).json({statusCode:500, status:false,message:"Internal server error"});
              }
              else{
                return res.status(201).json({statusCode:201, status:true,message:"player_id created successfully"});
              }
            })
        }
    }
    else{
      return res.status(400).json({"message" : "Bad Request - Your request is missing parameters. Please verify and resubmit"})
    }  
  },

  sendGiftAndTeaseNotification:async(req, res,next)=>{

    const { uuid, payload} = req.body
    console.log("your api is being hit by the client.....", req.body);
    if(uuid && payload.message && payload.title){
          if(payload.sender_profile && payload.notification_banner){
              let isValid = await validUrl.validate(payload.sender_profile,payload.notification_banner);
              if(!isValid){
                return res.status(400).json({statusCode:400,"error" : "Bad Request - sender_profile and notification_banner should be url. Please verify and resubmit"})
              }
          }
          const userInfo= await PlayerIdModel.findOne({$or: [
            {uuid: uuid}
          ]});
          if(userInfo){
            // return res.json({"message":userInfo})
            var notification = new OneSignal.Notification({
              contents: {
                  en: req.body.payload.message,
              },
              include_player_ids: [userInfo.player_id],
              small_icon: "", 
              large_icon: req.body.payload.sender_profile,
              big_picture:req.body.payload.notification_banner,
              content_available:true
            });
            notification.postBody["headings"] = {"en": req.body.payload.title};
            notificationHandler.send(notification, function(status, data, onesignalRes){
              if(status){
                return res.status(200).send({statusCode:200, status:true,message:"notification sent successfully"});
              }
              else{
                return res.status(500).send({statusCode:500, status:false,message:"Internal server error"});
              }
            })
          }
          else{
            return res.status(404).json({"error" : "No record found"})
          } 
    }
    else{
      return res.status(400).json({"message" : "Bad Request - Your request is missing parameters. Please verify and resubmit"})

    } 
  },

  sendByPlayerIds:async(req, res)=>{
    const {uuid, payload} = req.body;
    const playerIds = [];
    if(uuid && payload.message && payload.title){
      if(payload.sender_profile && payload.notification_banner){
        let isValid = await validUrl.validate(payload.sender_profile,payload.notification_banner);
        if(!isValid){
          return res.status(400).json({statusCode:400,"message" : "Bad Request - sender_profile and notification_banner should be url. Please verify and resubmit"});
        }
      }
        PlayerIdModel.find({
          'uuid': { $in:req.body.uuid}
        }, function(err, record){
        if(record.length){
                let object = Object.keys(record).map(key => record[key]);
                object.forEach((element, index, array) => {
                    playerIds.push(element.player_id)
                });
                var notification = new OneSignal.Notification({
                  contents: {
                      en: req.body.payload.message,
                  },
                  include_player_ids: playerIds,
                  small_icon: "", 
                  large_icon: req.body.payload.sender_profile,
                  big_picture:req.body.payload.notification_banner
              });
              // notification.postBody["data"] = {"type": "marketing", "data": "sikandar"}; 
              notification.postBody["headings"] = {"en": req.body.payload.title, "es": req.body.payload.title};
              notificationHandler.send(notification, function(status, data, onesignalRes){
                if(status){
                      return res.status(200).send({statusCode:200, status:true,message:"notification sent successfully"});
                   
                }
                else
                {
                  return res.status(500).send({statusCode:500, status:false,message:"Internal server error"});
                }
              });
          }})
      }  
      else{
        return res.status(400).json({statusCode:400,"message" : "Bad Request - sender_profile and notification_banner should be url. Please verify and resubmit"})
      }
  },
  deletePlayerId:async(req, res)=>{
    const {uuid} = req.body;
    if(uuid){
      PlayerIdModel.deleteOne({uuid:uuid }, function (err) {
        if(err){
          return res.status(500).json({statusCode:500, status:false,message:"Internal server error"});
        }
        else{
          return res.status(204).json({statusCode:204, status:true,message:"record deleted successfully"});
        }
      });
    }
  }
}
