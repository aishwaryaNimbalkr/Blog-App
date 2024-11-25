import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Button, ListGroup } from 'react-bootstrap';

const BlogDetail = () => {
  const { id } = useParams();  // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Fetch the blog details on component mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/admin/blogs/${id}`);
        setBlog(response.data.blog);

        // Check if the user is authorized to edit the blog (check localStorage for token)
        const token = localStorage.getItem('token');
        if (token) {
          // Decode the token to extract user information (you can use jwt-decode library)
          const decodedToken = JSON.parse(atob(token.split('.')[1])); // Simple decode for example
          // Check if the decoded user ID matches the author ID of the blog
          if (decodedToken.id === response.data.blog.author._id || decodedToken.isAdmin) {
            setIsAuthorized(true);  // User is authorized to edit
          }
        }
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

  return (
    <div className="container mt-5">
      <Card>
        <Card.Body>
          <Card.Title>{blog.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">By {blog.author.userName}</Card.Subtitle>
          <Card.Text>{blog.content}</Card.Text>
          
          <div>
            <strong>Likes:</strong> {blog.likes}
          </div>

          <h5 className="mt-4">Comments:</h5>
          {blog.comments && blog.comments.length > 0 ? (
            <ListGroup>
              {blog.comments.map((comment, index) => (
                <ListGroup.Item key={index}>
                  <strong>{comment.user.userName}</strong>: {comment.text}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div>No comments yet.</div>
          )}

          {/* Conditionally show the edit button based on authorization */}
          {isAuthorized && (
            <div className="mt-3">
              <Button variant="primary" onClick={() => window.location.href = `/editBlog/${blog._id}`}>
                Edit Blog
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default BlogDetail;
