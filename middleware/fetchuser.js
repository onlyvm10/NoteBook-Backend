var jwt = require('jsonwebtoken');
const JWT_secret = '2ce2zw0ab5';

const fetchuser=(req,res,next)=>{
  //fetches a user from auth token and appends it to the req object and then calls next();
   const token  = req.header('auth-token');
   if(!token){
    res.status(401).send("Please authenticate using a valid token.");
   }
   try {
    const data = jwt.verify(token,JWT_secret);
    req.user = data.user;//append
    next();
   } catch (error) {
    res.status(401).send("Please authenticate using a valid token.");
   }
   
    

}
module.exports = fetchuser;