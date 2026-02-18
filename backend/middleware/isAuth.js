//import jwt from "jsonwebtoken" 
//const isAuth =async (req, res, next) =>{
    //try{
        //// const token = req.cookies.token
      //   if(!token){
      //      return res.status(400).json({message: "token is not found"}) 
      //  }
      //  const verifyToken = await jwt.verify(token,process.env.JWT_SECRET)  
      //  req.userId = verifyToken.userId 
      //  next()
   // } catch (error) {
    //    return res.status(500).json({message: `is auth error ${error}`}) 
   // }
//}
//export default isAuth 
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        // 1️⃣ Read token from Authorization Header
        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 2️⃣ If not in header, read from cookies
        if (!token) {
            token = req.cookies.token;
        }

        // 3️⃣ If still missing, return 401
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        // 4️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } 
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default isAuth;
