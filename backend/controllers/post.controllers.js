import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js" 
import User from "../models/user.model.js"  

export const uploadPost = async (req,res) =>{
    try {
        const {caption,mediaType} = req.body
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path)

        }
        else{
            return res.status(400).json({message: "media is required"}) 
        }
        const post = await Post.create({
            caption,media,mediaType,author : req.userId 
        })
        const user = await User.findById(req.userId) 
        user.posts.push(post._id) 
        await user.save() 
        const populatedPost = await Post.findById(post._id).populate("author","name userName profileImage")
        return res.status(201).json(populatedPost)  
    } catch (error) {
        return res.status(500).json({message:`uploadPost error ${error}`})

    }
    
}


export const getAllPosts = async (req,res)=>{
            try {
                const posts = await Post.find({}).populate("author","name userName profileImage").populate("comments.author","name userName profileImage").sort({createdAt:-1})  
                return res.status(200).json(posts) 
            } catch (error) {
                  return res.status(500).json({message:`getallpost error ${error}`}) 
            }
}


export const like = async (req, res) => {
  try {
    const postId = req.params.postId;

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);

      if (post.author.toString() !== req.userId.toString()) {
        await Notification.create({
          sender: req.userId,
          receiver: post.author,
          type: "like",
          post: post._id,
          message: "liked your post",
        });
      }
    }

    await post.save();

    post = await Post.findById(post._id)
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage");

    return res.status(200).json(post);
  } catch (error) {
    console.error("LIKE ERROR 💥", error);
    return res.status(500).json({ message: "like failed" });
  }
};



export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const postId = req.params.postId;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "comment is required" });
    }

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    post.comments.push({
      author: req.userId,
      message,
    });

    if (post.author.toString() !== req.userId.toString()) {
      await Notification.create({
        sender: req.userId,
        receiver: post.author,
        type: "comment",
        post: post._id,
        message: "commented on your post",
      });
    }

    await post.save();

    post = await Post.findById(post._id)
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage");

    return res.status(200).json(post);
  } catch (error) {
    console.error("COMMENT ERROR 💥", error);
    return res.status(500).json({ message: "comment failed" });
  }
};





{/*export const saved = async (req, res) => {
  try {
    const postId = req.params.postId;

    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const alreadySaved = user.saved.some(
      (id) => id.toString() === postId.toString()
    );

    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() !== postId.toString()
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();

    // 🔥 THIS IS THE FIX
    user = await User.findById(user._id).populate({
      path: "saved",
      populate: {
        path: "author",
        select: "userName profileImage name"
      }
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("SAVE POST ERROR 💥", error);
    return res.status(500).json({ message: "save post failed" });
  }
};
*/}
export const saved = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadySaved = user.saved.includes(postId);

    if (alreadySaved) {
      user.saved = user.saved.filter(id => id.toString() !== postId);
    } else {
      user.saved.push(postId);
    }

    await user.save();

    return res.status(200).json({
      saved: user.saved   // ✅ ONLY send saved array
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
