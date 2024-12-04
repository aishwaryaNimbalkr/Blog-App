const express = require('express');
const  auth  = require('../Middleware/auth');
const { getAllBlogs, addComment, toggleLike, createBlog, editBlog, deleteBlog, getBlogById, getMyBlogs} = require('../Controller/blogController');
const { upload } = require('../Middleware/uploads');


const Router = express.Router();

// Routes for **any** user (registered or not)
Router.get('/blogs', getAllBlogs);  // All users (including guests) can view blogs
Router.get('/:id',getBlogById);
Router.get('/myblogs/:id', auth, getMyBlogs);
Router.post('/comment/:blogId', auth,addComment);  // Any logged-in user can comment on blogs
Router.put('/like/:blogId', auth, toggleLike);  // Any logged-in user can like/unlike blogs

// Routes for **authenticated users**
Router.post('/addBlog', auth,upload.array('images', 5), createBlog);  // Logged-in users can add their own blogs
Router.put('/editBlog/:id', auth,upload.array('images', 5),  editBlog);  // Users can edit their own blogs
Router.delete('/deleteBlog/:id', auth, deleteBlog);  // Users can delete their own blogs



module.exports = Router;
