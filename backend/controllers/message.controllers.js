import uploadOnCloudinary from "../config/cloudinary.js" 
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js" 
import { getSocketId,io } from "../socket.js"

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Validate
    if (!message && !image) {
      return res.status(400).json({ message: "Cannot send empty message" });
    }

    // Create new message first
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image: image || null,
    });

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id]
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Emit socket event to receiver if online
    const receiverSocketId = getSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);

  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ message: `sendMessage error: ${error.message}` });
  }
};


export const getAllMessages = async (req, res) =>{
    try{
        const senderId = req.userId
        const receiverId = req.params.receiverId 

        const conversation = await Conversation.findOne({
             participants:{$all:[senderId, receiverId]}
    }).populate("messages") 

    return res.status(200).json(conversation?.messages) 
    } 
    catch (error){
           return res.status(500).json({message:`get Message error ${error}`}) 
    }
}

//export const getPrevUserChats = async (req, res) =>{
   // try {
       // const currentUserId = req.userId
      //  const conversations = await Conversation.find({
           // participants:currentUserId

       // }).populate("participants").sort({updatedAt:-1})

       // const userMap={}
       // conversations.foreach(conv =>{
               // conv.participants.forEach(user =>{
                   // if(user._id!= currentUserId) {
                      //  userMap[user._id] = user 
                  //  }
               // });
       // });

       // const previousUsers = Object.values(userMap) 
//  return res.status(200).json(previousUsers)
  //  } catch (error) {
       //  return res.status(500).json({message:`prev user error ${error}`}) 
   // }
//}








export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversations = await Conversation.find({
      participants: { $in: [currentUserId] }
    })
      .populate("participants", "-password")
      .sort({ updatedAt: -1 });

    const userMap = {};

    conversations.forEach((conv) => {
      conv.participants.forEach((user) => {
        if (user._id.toString() !== currentUserId) {
          userMap[user._id] = user;
        }
      });
    });

    const previousUsers = Object.values(userMap);
    return res.status(200).json(previousUsers);

  } catch (error) {
    console.error("prev chat error:", error);
    return res.status(500).json({ message: "Failed to get previous chats" });
  }
};

