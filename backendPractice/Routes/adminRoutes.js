const express = require('express');
const Router = express.Router();
const { getAllBlogs, deleteBlog, getBlogById } = require('../Controller/blogController');
const { getAllUsers, deleteUser } = require('../Controller/userController');
const { isAdmin } = require('../Middleware/adminMiddleware')
const auth = require('../Middleware/auth')
// Routes for **admin users**
Router.get('/blogs', auth, isAdmin, getAllBlogs);  // Admin can view all blogs
Router.delete('/deleteBlog/:id', auth,isAdmin , deleteBlog);  // Admin can delete any blog
// Router.get('/blogs/:id',auth,isAdmin,getBlogById)
Router.get('/users', auth, isAdmin,getAllUsers);
Router.delete('/deleteUser/:id', auth, isAdmin, deleteUser);


module.exports = Router;