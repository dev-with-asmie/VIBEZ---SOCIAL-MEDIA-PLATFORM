import express from "express"
import isAuth from "../middleware/isAuth.js" 
import { editProfile, follow, followingList, getAllNotifications, getCurrentUser, getProfile, markAsRead, search, suggestedUsers } from "../controllers/user.controllers.js" 
import { signIn } from "../controllers/auth.controllers.js"
import { upload } from "../middleware/multer.js" 


const userRouter = express.Router() 

userRouter.get("/current",isAuth, getCurrentUser)
userRouter.get("/signin", signIn)
userRouter.get("/suggested",suggestedUsers) 
userRouter.get("/getProfile/:userName",isAuth,getProfile) 
userRouter.get("/follow/:targetUserId",isAuth,follow)
userRouter.get("/followingList",isAuth,followingList)  
userRouter.get("/search",isAuth,search)  
userRouter.get("/getAllNotifications",isAuth,getAllNotifications) 
userRouter.post("/markAsRead",isAuth,markAsRead)  
//userRouter.post("/editProfile", isAuth,upload.single("profileImage"),editProfile) 
userRouter.post("/editProfile", isAuth,upload.single("profileImage"), editProfile);


export default userRouter 