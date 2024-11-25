const Blog = require('../Model/blogSchema');
const multer = require('multer');
const path = require('path');

// Set up multer storage and file name for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blog_images');  // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);  // Save file with a unique name
  },
});

// Multer setup with size and file filter restrictions
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB file size limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// Create a new blog
exports.createBlog = upload.array('images', 5), async (req, res) => {
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

// Edit an existing blog (only by the author or admin)
exports.editBlog = upload.array('images', 5), async (req, res) => {
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

  try {
    // Find the blog by ID and populate the 'author' field with 'userName'
    const blog = await Blog.findById(id).populate('author', 'userName');

    // If blog is not found, return a 404 error
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

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
    const blog = await Blog.findById(blogId); 
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Create a comment object and add it to the blog's comments array
    const comment = {
      user: req.user.id,  // User ID from the authentication token
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
