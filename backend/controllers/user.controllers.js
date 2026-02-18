import User from "../models/user.model.js" 
import uploadOnCloudinary from "../config/cloudinary.js"
import Notification from "../models/notification.model.js"

export const getCurrentUser = async (req,res) =>{
    try{
        const userId = req.userId 
        //const user = await User.findById(userId).populate("posts waves posts.author posts.comments story following")  
        const user = await User.findById(userId)
.populate({
  path: "posts",
  populate: {
    path: "author comments.author",
    select: "userName profileImage name"
  }
})
.populate({
  path: "saved",
  populate: {
    path: "author",
    select: "userName profileImage name"
  }
})
.populate("waves story following");
   
        if(!user){
            return res.status(400).json({message: "user not found"}) 
        }
        return res.status(200).json(user) 
    }
    catch (error) {
       return res.status(500).json({message:`get current user error ${error}`}) 
    }
}
    


export const suggestedUsers = async (req, res) =>{
    try { 
        const users = await User.find({
            _id:{$ne:req.userId}
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
          return res.status(500).json({message:`get suggested user error ${error}`}) 
    }
}
export const editProfile = async (req,res) =>{
    console.log("EDIT PROFILE HIT");          // 👈 add this
    console.log("BODY:", req.body);            // 👈 add this
    console.log("FILE:", req.file);   
        try {
            const {name="",userName="",bio="",profession="",gender=""} = req.body
            const user = await User.findById(req.userId).select("-password")
            if(!user){
                return res.status(400).json({message:"user not found"})

            }
            const sameUserWithUserName = await User.findOne({userName}).select("-password") 
            if(sameUserWithUserName && sameUserWithUserName._id.toString() !== req.userId.toString()){
                return res.status(400).json({message:"userName already exist"})
            }
           let profileImage;
            if(req.file){
                console.log("UPLOADING TO CLOUDINARY");
                profileImage = await uploadOnCloudinary(req.file.path) 
            }
            user.name = name
            user.userName = userName
            if(profileImage){
                  user.profileImage = profileImage
            } 
            user.bio = bio
            user.profession = profession 
            if(gender){
            user.gender = gender 
            } 

            await user.save() 
            return res.status(200).json(user) 
        } catch (error) {
            console.error("EDIT PROFILE ERROR 💥", error);  
            return res.status(500).json({message:`edit profile error ${error}`}) 
            
        }
}

{/*export const getProfile = async (req,res)=>{
    try {
        const userName = req.params.userName;
        const user = await User.findOne({userName}).select("-password").populate("posts waves followers following"); 
        if(!user){
            return res.status(400).json({message:"user not found"}) 
        }
        return res.status(200).json(user) 
    } catch (error) {
         return res.status(500).json({message:`get profile error ${error}`}) 
    }
}
    */} 
export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName })
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "author",
          select: "userName profileImage name"
        }
      })
      .populate({
        path: "saved",
        populate: {
          path: "author",
          select: "userName profileImage name"
        }
      }) 
      .populate({
        path: "followers",
        select: "userName profileImage name"
      })
      .populate({
        path: "following",
        select: "userName profileImage name"
      });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get profile error ${error}` });
  }
};


export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.targetUserId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
      );
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json(currentUser);

  } catch (error) {
    console.log("FOLLOW ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const followingList = async (req,res)=>{
        try {
            const result = await User.findById(req.userId)
            return res.status(200).json(result?.following)
        } catch (error) {
             return res.status(500).json({message:`following error ${error}`}) 
        }
}



export const search = async (req, res)=>{
    try {
        const keyWord = req.query.keyword

        if(!keyWord){
             return res.status(400).json({message:"keyword is required"}) 
        }

        const users = await User.find({
            $or:[
                {userName: {$regex:keyWord,$options:"i"}},
                {name: {$regex:keyWord,$options:"i"}} 
            ]
        }).select("-password") 

        return res.status(200).json(users) 
    } catch (error) {
          return res.status(500).json({message:`search error ${error}`}) 
    }
}


export const getAllNotifications = async (req, res)=>{
    try {
        const notifications = await Notification.find({
            receiver: req.userId
        }).populate("sender receiver post wave").sort({createdAt:-1}) 
        return res.status(200).json(notifications) 
    } catch (error) {
        return res.status(500).json({message:`get notification error ${error}`}) 
    }

}

export const markAsRead = async (req, res)=>{
    try {
        const {notificationId}= req.body 
        if(Array.isArray(notificationId)){
            await Notification.updateMany(
                {_id:{$in: notificationId}, receiver: req.userId},
                {$set:{isRead:true}}
            );

        }
        else{
            await Notification.findOneAndUpdate(
                
                    {_id: notificationId, receiver:req.userId},
                    { $set:{isRead: true}}
                )
            }
            return res.status(200).json({message:"marked as read"})
        }
        catch (error){

        }
    
}