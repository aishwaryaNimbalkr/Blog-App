import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Button, Form } from 'react-bootstrap';

const CreateBlog = () => {
  const navigate = useNavigate(); // UseNavigate to redirect after the blog is created
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input changes (title and content)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle image file input change
  const handleFileChange = (e) => {
    setNewImages(e.target.files);
  };

  // Handle form submission for creating a new blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    // Append title and content to formData
    formData.append('title', blog.title);
    formData.append('content', blog.content);

    // Append the images to the formData
    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }

    try {
      const token = localStorage.getItem('token');  // Get token from localStorage

      // Send the request to create the new blog
      const response = await axios.post('http://localhost:4000/api/blog/addBlog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // Include token in the request header
        }
      });

      setLoading(false);
      navigate(`/blog/${response.data.blog._id}`);  // Redirect to the created blog's page
    } catch (err) {
      setLoading(false);
      setError('Error creating blog');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Blog</h2>
      {error && <p className="text-danger">{error}</p>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter blog title"
            name="title"
            value={blog.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="content" className="mt-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter blog content"
            name="content"
            value={blog.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="images" className="mt-3">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </Form.Group>

        <div className="mt-4">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Blog'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateBlog;
