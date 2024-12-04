import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button, Form } from 'react-bootstrap';

const EditBlog = () => {
  const { id } = useParams();  // Get the blog ID from the URL
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the blog data on component mount to pre-fill the form
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const token = localStorage.getItem('token');  // Get the token from localStorage
        const response = await axios.get(`http://localhost:4000/api/blog/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`  // Pass token in the request header
          }
        });
        setBlog(response.data.blog);
      } catch (err) {
        setError('Blog not found or failed to fetch data');
      }
    };
    fetchBlogData();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle image file change
  const handleFileChange = (e) => {
    setNewImages(e.target.files);
  };

  // Handle form submission to update the blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    
    // Append the form fields to formData
    formData.append('title', blog.title);
    formData.append('content', blog.content);

    // Append the new images to the formData
    for (let i = 0; i < newImages.length; i++) {
      formData.append('images', newImages[i]);
    }

    try {
      const token = localStorage.getItem('token');  // Get the token again before making the request

      // Send the request to the backend to update the blog
      const response = await axios.put(`http://localhost:4000/api/blog/editBlog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // Include token in the request header
        }
      });
      
      setLoading(false);
      navigate(`/blog/${id}`); // Redirect to the blog page after successful update
    } catch (err) {
      setLoading(false);
      setError('Error updating blog');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Blog</h2>
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
            {loading ? 'Updating...' : 'Update Blog'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditBlog;
