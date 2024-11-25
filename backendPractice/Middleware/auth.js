const jwt= require('jsonwebtoken')

const auth=(req,res,next)=>{
try{
    const token= req.headers.authorization.split(" ")[1]

    if(!token)
        return res.status(400).json({message:"token is missinhg"})
    const decode = jwt.verify(token,'SECRETEKEY')
    if(!decode)
        return res.status(400).json({message:"invalid token"})
    console.log(decode)
    req.user =decode
    console.log('User:', req.user);  // This should print the user object, including isAdmin
console.log('User isAdmin:', req.user.isAdmin);
    next()

}catch(err){
    res.status(401).json({message:err})
}
}
module.exports= auth

