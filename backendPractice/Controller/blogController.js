const Blog = require('../Model/blogSchema');

const path = require('path');
const User = require('../Model/userSchema');


// Create a new blog
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const imagePaths = req.files ? req.files.map(file => file.path) : [];

  try {
    const blog = new Blog({
      title,
      content,
      author: req.user.id,
      images: imagePaths,
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'userName')  // Populate the author field with userName
      .sort({ createdAt: -1 });  // Sort blogs by creation date, newest first

    res.status(200).json({ message: 'Blogs retrieved successfully', blogs });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get my blogs (blogs by the authenticated user)
exports.getMyBlogs = async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await Blog.find({ author: id })  // Filter blogs by the user's ID
      .populate('author', 'userName')  // Populate the author field with userName
      .sort({ createdAt: -1 });  // Sort blogs by creation date, newest first
    
    res.status(200).json({ message: 'My blogs retrieved successfully', blogs });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Edit an existing blog (only by the author or admin)
exports.editBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const imagePaths = req.files ? req.files.map(file => file.path) : [];

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to edit this blog' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.images = [...blog.images, ...imagePaths]; // Add new images

    await blog.save();
    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a blog (only by the author or admin)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    console.log(req.user.isAdmin);
    if (blog.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;  // Get the blog ID from the URL parameters
  const { user } = req; // Get the authenticated user from the request (if present)

  try {
    // Find the blog by ID and populate the 'author' field with 'userName'
    const blog = await Blog.findById(id).populate('author', 'userName');

    // If blog is not found, return a 404 error
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Remove the check for admin or author (Allow all users to view the blog)
    // Return the blog if found
    res.status(200).json({ message: 'Blog retrieved successfully', blog });
  } catch (err) {
    // Handle errors and return a 400 status
    res.status(400).json({ message: err.message });
  }
};



// Add a comment to a blog
exports.addComment = async (req, res) => {
  const { blogId } = req.params;
  const { content } = req.body;

  try {
    const blog = await Blog.findById(blogId).populate('comments.user', 'userName');; 
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

     // Fetch the user who is making the comment
     const user = await User.findById(req.user.id);  // Assuming User is the model for users
     if (!user) return res.status(404).json({ message: 'User not found' });

    // Create a comment object and add it to the blog's comments array
    const comment = {
      user: req.user.id,  // User ID from the authentication token
      userName: user.userName,  
      content,
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Like or Unlike a blog
exports.toggleLike = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const userId = req.user.id;

    // If the user has already liked the blog, remove the like (unlike)
    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(like => like.toString() !== userId.toString());
      await blog.save();
      return res.status(200).json({ message: 'Blog unliked successfully' });
    } else {
      // If the user has not liked the blog, add the like
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: 'Blog liked successfully' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
