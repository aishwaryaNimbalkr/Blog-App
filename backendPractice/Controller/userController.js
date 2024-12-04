const User= require('../Model/userSchema')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken');
const Blog = require('../Model/blogSchema');


exports.Register = async (req, res) => {
    const { userName, userEmail, userPassword, isAdmin } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(userPassword, 10);
  
      // Check if the email already exists
      const existingUser = await User.findOne({ userEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
  
      const user = new User({
        userName,
        userEmail,
        userPassword: hashedPassword,
        isAdmin: isAdmin || false,  // Default to false, or true if provided
      });
  
      await user.save();
      res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
exports.Login=async(req,res)=>{
 const {userEmail,userPassword} = req.body
    try{
        const user = await User.findOne({userEmail})
        if(!user)
            return res.status(401).json({message:"User does not exist"})

        const compare =await bcrypt.compare(userPassword,user.userPassword)
        if(!compare)
            return res.status(400).json({message:"invalid credentials"})

        const token = jwt.sign({id:user._id,userName: user.userName,isAdmin:user.isAdmin},'SECRETEKEY')
        console.log(token)
      
res.status(201).json({ token, user })
    }catch(err){
        res.status(400).json({message:err})
    }
}


// Get all users (Admin-only)
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // Delete any user (Admin-only)
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      await Blog.deleteMany({ author: req.params.id });
      // Delete the user
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };