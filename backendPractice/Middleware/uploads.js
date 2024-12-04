
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
  exports.upload = upload;
  