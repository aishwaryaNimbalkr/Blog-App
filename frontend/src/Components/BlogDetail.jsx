import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';
import { FaRegHeart } from "react-icons/fa";
const BlogDetail = () => {
  const { id } = useParams();  // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the blog details on component mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Pass the JWT token in the Authorization header
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await axios.get(`http://localhost:4000/api/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Send the token to the backend
          },
        });
        console.log(response.data)
        setBlog(response.data.blog);
      } catch (err) {
        setError('Failed to fetch blog details');
      }
    };

    fetchBlog();
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!blog) {
    return <div>Loading...</div>;
  }
console.log(blog.comments)
  return (
    <div className="text-center m-5 p-5" >
         <div className='border border-4 border-dark shadow-2 rounded w-75 mx-auto p-3 'style={{backgroundColor:"aliceblue"}} >
      <Card>
        <Card.Body>
          <Card.Title className='fw-bold fs-4'>{blog.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">By {blog.author.userName}</Card.Subtitle>
          <Card.Text>{blog.content}</Card.Text>

          {/* Render Images if available */}
          {blog.images && blog.images.length > 0 && (
            <div>
              
              <div className="blog-images">
                
                {blog.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:4000/${image}`} // Assuming image URL is relative and served from your backend
                    alt={`Blog imag ${index + 1}`}
                    className="img-fluid mb-3"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <strong><FaRegHeart color='red' size="20"/></strong> {blog.likes.length}
          </div>

          <h5 className="mt-4">Comments:</h5>
          {blog.comments && blog.comments.length > 0 ? (
            
            <ListGroup>
              {blog.comments.map((comment, index) => (
                <ListGroup.Item key={index}>
                  <strong>{comment.userName}</strong>: {comment.content}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div>No comments yet.</div>
          )}
        </Card.Body>
      </Card>
    </div><br/><br/><br/><br/><br/><br/><br/>
    </div>
  );
};

export default BlogDetail;
