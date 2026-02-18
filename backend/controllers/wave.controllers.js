import User from "../models/user.model.js";
import Wave from "../models/wave.model.js";
import uploadOnCloudinary from "../config/cloudinary.js" 
import { getSocketId, io } from "../socket.js";
import Notification from "../models/notification.model.js";

export const uploadWave = async (req,res) =>{
    try {
        const {caption} = req.body
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path)

        }
        else{
            return res.status(400).json({message: "media is required"}) 
        }
        const wave = await Wave.create({
            caption,media,author : req.userId 
        })
        const user = await User.findById(req.userId) 
        user.waves.push(wave._id) 
        await user.save() 
        const populatedWave = await Wave.findById(wave._id).populate("author","name userName profileImage")
        return res.status(201).json(populatedWave)  
    } catch (error) {
        return res.status(500).json({message:`uploadwave error ${error}`})

    }
    
}

export const like = async (req,res) =>{
    try {
        const waveId = req.params.waveId
        const wave = await Wave.findById(waveId) 
        if(!wave){
            return res.status(400).json({message:"wave not found"}) 

        }

        const alreadyLiked = wave.likes.some(id=>id.toString()==req.userId.toString()) 
        if(alreadyLiked){
            wave.likes=wave.likes.filter(id=>id.toString()!=req.userId.toString()) 
        }
        else{
          wave.likes.push(req.userId)
         // if(wave.author._id!= req.userId){
         if(wave.author.toString() !== req.userId.toString()){

                const notification = await Notification.create({
                    sender:req.userId,
                    receiver: wave.author._id,
                    type: "like",
                    wave: wave._id,
                    message:"liked your wave"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver wave") 
                const receiverSocketId = getSocketId(wave.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification) 
                }

          }
        }
        await wave.save() 
        await wave.populate("author","name userName profileImage") 
        io.emit("likedWave",{
            waveId : wave._id,
            likes:wave.likes
        })
        return res.status(200).json(wave) 

    } catch (error) {
        return res.status(500).json({message:`like wave error ${error}`}) 
    }
}
export const comment = async (req,res)=>{
    try {
        const {message} = req.body 
        const waveId = req.params.id
        const wave = await Wave.findById(waveId) 
        if(!wave){
            return res.status(400).json({message:"wave not found"}) 
        }
        wave.comments.push({
            author: req.userId,
            message
        })
         if(wave.author._id!= req.userId){
                const notification = await Notification.create({
                    sender:req.userId,
                    receiver: wave.author._id,
                    type: "comment", 
                    wave: wave._id,
                    message:"commented your wave"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver wave") 
                const receiverSocketId = getSocketId(wave.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification) 
                }

        }
        await wave.save() 
        await wave.populate("author","name userName profileImage"),
        await wave.populate("comments.author") 
        io.emit("commentedWave",{
            waveId : wave._id,
            comments:wave.comments 
        })
        return res.status(200).json(wave) 


    } catch (error) {
           return res.status(500).json({message:`comment wave error ${error}`}) 
    }
}

export const getAllWaves = async (req,res)=>{
             try {
                const waves = await Wave.find({}).
                populate("author","name userName profileImage").populate("comments.author") 
                return res.status(200).json(waves) 
             } catch (error) {
                  return res.status(500).json({message:`get all wave error ${error}`}) 
             }
}
