const express = require('express');
const  auth  = require('../Middleware/auth');
const { getAllBlogs, addComment, toggleLike, createBlog, editBlog, deleteBlog, getBlogById } = require('../Controller/blogController');

const Router = express.Router();

// Routes for **any** user (registered or not)
Router.get('/blogs', getAllBlogs);  // All users (including guests) can view blogs
Router.get('/blogs/:blogId',getBlogById);
Router.post('/comment/:blogId', auth,addComment);  // Any logged-in user can comment on blogs
Router.put('/like/:blogId', auth, toggleLike);  // Any logged-in user can like/unlike blogs

// Routes for **authenticated users**
Router.post('/addBlog', auth, createBlog);  // Logged-in users can add their own blogs
Router.put('/editBlog/:id', auth, editBlog);  // Users can edit their own blogs
Router.delete('/deleteBlog/:id', auth, deleteBlog);  // Users can delete their own blogs



module.exports = Router;
