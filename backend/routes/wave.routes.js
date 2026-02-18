import express from "express"
import isAuth from "../middleware/isAuth.js" 

import { upload } from "../middleware/multer.js" 
import { comment, getAllWaves, like, uploadWave } from "../controllers/wave.controllers.js"



const waveRouter = express.Router() 

waveRouter.post("/upload",isAuth,upload.single("media"), uploadWave)
waveRouter.get("/getAll",isAuth,getAllWaves) 
waveRouter.get("/like/:waveId",isAuth,like)
waveRouter.post("/comment/:id",isAuth,comment) 




export default waveRouter